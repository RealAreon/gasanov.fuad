export const PaymentBadges = () => (
  <div className="payment-badges" aria-label="Accepted payment methods">
    <svg width="40" height="26" viewBox="0 0 40 26" aria-hidden="true">
      <rect width="40" height="26" rx="4" fill="#1a1f71" />
      <text x="20" y="17" textAnchor="middle" fontSize="9" fontWeight="700" fontFamily="Arial, sans-serif" fill="#fff">
        VISA
      </text>
    </svg>
    <svg width="40" height="26" viewBox="0 0 40 26" aria-hidden="true">
      <rect width="40" height="26" rx="4" fill="#16171a" />
      <circle cx="17" cy="13" r="7" fill="#eb001b" />
      <circle cx="24" cy="13" r="7" fill="#f79e1b" fillOpacity="0.9" />
    </svg>
    <svg width="40" height="26" viewBox="0 0 40 26" aria-hidden="true">
      <rect width="40" height="26" rx="4" fill="#2e77bc" />
      <text x="20" y="17" textAnchor="middle" fontSize="8" fontWeight="700" fontFamily="Arial, sans-serif" fill="#fff">
        AMEX
      </text>
    </svg>
    <svg width="40" height="26" viewBox="0 0 40 26" aria-hidden="true">
      <rect width="40" height="26" rx="4" fill="#003087" />
      <text x="20" y="17" textAnchor="middle" fontSize="7" fontWeight="700" fontFamily="Arial, sans-serif" fill="#fff">
        PayPal
      </text>
    </svg>
  </div>
);
