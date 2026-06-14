import { useEffect, useState } from "react";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import { Copy, CheckCircle2, Clock, CreditCard, Smartphone, Landmark, AlertCircle } from "lucide-react";
import { useOrderStore } from "../store/orderStore";
import { usePaymentStore } from "../store/paymentStore";
import { formatPrice } from "../utils/format";

const METHOD_LABEL = {
  bank_transfer: "Bank Transfer",
  ewallet: "E-Wallet",
  card: "Credit / Debit Card",
};

export default function Payment() {
  const { id } = useParams();
  const navigate = useNavigate();

  const order = useOrderStore((s) => s.getOrder(id));
  const updateOrderStatus = useOrderStore((s) => s.updateOrderStatus);
  const payment = usePaymentStore((s) => s.getPayment(id));
  const confirmPayment = usePaymentStore((s) => s.confirmPayment);

  const [confirming, setConfirming] = useState(false);
  const [copied, setCopied] = useState("");
  const [cardForm, setCardForm] = useState({ number: "", name: "", expiry: "", cvv: "" });
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    if (!payment) return;
    const tick = () => {
      const ms = payment.expiresAt - Date.now();
      setTimeLeft(Math.max(0, ms));
    };
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, [payment]);

  if (!order || !payment) return <Navigate to="/orders" replace />;
  if (order.status === "paid") return <Navigate to={`/order-success/${id}`} replace />;

  async function handleConfirm() {
    setConfirming(true);
    await new Promise((r) => setTimeout(r, 1000)); // simulate processing
    confirmPayment(id);
    updateOrderStatus(id, "paid");
    navigate(`/order-success/${id}`);
  }

  function copy(text, key) {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(""), 2000);
  }

  const mins = timeLeft != null ? Math.floor(timeLeft / 60000) : 15;
  const secs = timeLeft != null ? Math.floor((timeLeft % 60000) / 1000) : 0;
  const expired = timeLeft === 0;

  return (
    <div className="max-w-lg mx-auto px-4 py-8 animate-fadeIn">
      {/* Header card */}
      <div className="bg-surface dark:bg-dark-surface rounded-2xl border border-border dark:border-dark-border shadow-card p-5 mb-4">
        <div className="flex items-center justify-between mb-1">
          <p className="text-xs text-muted font-medium uppercase tracking-wide">{METHOD_LABEL[payment.method]}</p>
          <span className={`flex items-center gap-1 text-xs font-semibold ${expired ? "text-primary" : "text-orange-500"}`}>
            <Clock size={12} />
            {expired ? "Expired" : `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`}
          </span>
        </div>
        <p className="text-2xl font-extrabold text-primary mb-0.5">{formatPrice(payment.amount)}</p>
        <p className="text-xs text-muted">Order {order.orderNumber}</p>
      </div>

      {/* Payment method UI */}
      {payment.method === "bank_transfer" && (
        <BankTransfer payment={payment} copy={copy} copied={copied} />
      )}
      {payment.method === "ewallet" && (
        <EWallet payment={payment} copy={copy} copied={copied} />
      )}
      {payment.method === "card" && (
        <CardForm cardForm={cardForm} setCardForm={setCardForm} />
      )}

      {/* Confirm button */}
      {expired ? (
        <div className="flex items-center gap-2 text-sm text-primary bg-primary/10 rounded-xl px-4 py-3 mt-4">
          <AlertCircle size={16} /> Payment window expired. Please create a new order.
        </div>
      ) : (
        <button
          onClick={handleConfirm}
          disabled={confirming}
          className="w-full mt-4 bg-primary text-white font-semibold rounded-xl py-3.5 hover:bg-primary-dark transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {confirming ? (
            <>
              <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              Verifying...
            </>
          ) : (
            <><CheckCircle2 size={18} /> I Have Paid — Confirm</>
          )}
        </button>
      )}

      <p className="text-center text-xs text-muted mt-3">
        This is a sandbox — clicking confirm always succeeds.
      </p>
    </div>
  );
}

/* ── Bank Transfer UI ─────────────────────────────────────────────────────── */
function BankTransfer({ payment, copy, copied }) {
  return (
    <div className="bg-surface dark:bg-dark-surface rounded-2xl border border-border dark:border-dark-border shadow-card p-5 space-y-4">
      <div className="flex items-center gap-3 mb-2">
        <span className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
          <Landmark size={20} className="text-primary" />
        </span>
        <div>
          <p className="text-sm font-bold text-ink dark:text-dark-ink">{payment.bankName} Virtual Account</p>
          <p className="text-xs text-muted">Transfer exactly to the account below</p>
        </div>
      </div>

      <div className="bg-bg dark:bg-dark-bg rounded-xl p-4">
        <p className="text-xs text-muted mb-1">Virtual Account Number</p>
        <div className="flex items-center justify-between gap-2">
          <p className="text-xl font-mono font-bold text-ink dark:text-dark-ink tracking-widest">{payment.virtualAccount}</p>
          <button onClick={() => copy(payment.virtualAccount, "va")}
            className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline shrink-0">
            {copied === "va" ? <><CheckCircle2 size={13} />Copied!</> : <><Copy size={13} />Copy</>}
          </button>
        </div>
      </div>

      <div className="text-xs text-muted space-y-1.5">
        <p className="font-semibold text-ink dark:text-dark-ink text-sm">How to pay:</p>
        <p>1. Open your {payment.bankName} mobile banking or ATM.</p>
        <p>2. Select "Transfer" → "Virtual Account".</p>
        <p>3. Enter the VA number above and confirm the amount.</p>
        <p>4. Click "I Have Paid" below after completing the transfer.</p>
      </div>
    </div>
  );
}

/* ── E-Wallet UI ──────────────────────────────────────────────────────────── */
function EWallet({ payment, copy, copied }) {
  return (
    <div className="bg-surface dark:bg-dark-surface rounded-2xl border border-border dark:border-dark-border shadow-card p-5 space-y-4">
      <div className="flex items-center gap-3 mb-2">
        <span className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
          <Smartphone size={20} className="text-primary" />
        </span>
        <div>
          <p className="text-sm font-bold text-ink dark:text-dark-ink">{payment.ewalletName}</p>
          <p className="text-xs text-muted">Scan the QR code with your e-wallet app</p>
        </div>
      </div>

      {/* Fake QR visual */}
      <div className="flex justify-center">
        <div className="w-44 h-44 rounded-2xl border-4 border-primary/20 p-3 bg-white">
          <div className="w-full h-full grid grid-cols-7 gap-0.5">
            {Array.from({ length: 49 }, (_, i) => (
              <div
                key={i}
                className={`rounded-sm ${[0,1,2,3,4,5,6,7,14,21,28,35,42,43,44,45,46,47,48,8,15,22,29,36,6,13,20,27,34,41,48].includes(i) ? "bg-ink dark:bg-dark-ink" : Math.random() > 0.5 ? "bg-ink dark:bg-dark-ink" : "bg-transparent"}`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="bg-bg dark:bg-dark-bg rounded-xl p-3 flex items-center justify-between gap-2">
        <p className="text-xs text-muted font-mono truncate">{payment.qrToken}</p>
        <button onClick={() => copy(payment.qrToken, "qr")} className="text-xs font-semibold text-primary hover:underline shrink-0">
          {copied === "qr" ? "Copied!" : "Copy"}
        </button>
      </div>
      <p className="text-xs text-muted text-center">Or open your {payment.ewalletName} app and enter the code above manually.</p>
    </div>
  );
}

/* ── Card Form UI ─────────────────────────────────────────────────────────── */
function CardForm({ cardForm, setCardForm }) {
  function fmt(field, val) {
    if (field === "number") val = val.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
    if (field === "expiry") val = val.replace(/\D/g, "").slice(0, 4).replace(/^(\d{2})(\d)/, "$1/$2");
    if (field === "cvv") val = val.replace(/\D/g, "").slice(0, 4);
    return val;
  }

  return (
    <div className="bg-surface dark:bg-dark-surface rounded-2xl border border-border dark:border-dark-border shadow-card p-5 space-y-4">
      <div className="flex items-center gap-3 mb-1">
        <span className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
          <CreditCard size={20} className="text-primary" />
        </span>
        <div>
          <p className="text-sm font-bold text-ink dark:text-dark-ink">Card Details</p>
          <p className="text-xs text-muted">Sandbox mode — any number works</p>
        </div>
      </div>

      {/* Card preview */}
      <div className="w-full h-36 rounded-2xl bg-gradient-to-br from-primary to-primary-dark p-5 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white/10 -mr-8 -mt-8" />
        <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full bg-white/10 -ml-6 -mb-6" />
        <p className="font-mono text-lg tracking-widest mb-3">{cardForm.number || "•••• •••• •••• ••••"}</p>
        <div className="flex items-end justify-between">
          <div>
            <p className="text-[10px] opacity-60 uppercase">Card Holder</p>
            <p className="text-sm font-semibold">{cardForm.name || "YOUR NAME"}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] opacity-60 uppercase">Expires</p>
            <p className="text-sm font-semibold">{cardForm.expiry || "MM/YY"}</p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <input placeholder="Card number" value={cardForm.number}
          onChange={(e) => setCardForm((f) => ({ ...f, number: fmt("number", e.target.value) }))}
          className="w-full border border-border dark:border-dark-border rounded-xl px-4 py-3 text-sm font-mono bg-transparent text-ink dark:text-dark-ink outline-none focus:border-primary" />
        <input placeholder="Card holder name" value={cardForm.name}
          onChange={(e) => setCardForm((f) => ({ ...f, name: e.target.value.toUpperCase() }))}
          className="w-full border border-border dark:border-dark-border rounded-xl px-4 py-3 text-sm bg-transparent text-ink dark:text-dark-ink outline-none focus:border-primary" />
        <div className="grid grid-cols-2 gap-3">
          <input placeholder="MM/YY" value={cardForm.expiry}
            onChange={(e) => setCardForm((f) => ({ ...f, expiry: fmt("expiry", e.target.value) }))}
            className="border border-border dark:border-dark-border rounded-xl px-4 py-3 text-sm font-mono bg-transparent text-ink dark:text-dark-ink outline-none focus:border-primary" />
          <input placeholder="CVV" value={cardForm.cvv} type="password"
            onChange={(e) => setCardForm((f) => ({ ...f, cvv: fmt("cvv", e.target.value) }))}
            className="border border-border dark:border-dark-border rounded-xl px-4 py-3 text-sm font-mono bg-transparent text-ink dark:text-dark-ink outline-none focus:border-primary" />
        </div>
      </div>
    </div>
  );
}
