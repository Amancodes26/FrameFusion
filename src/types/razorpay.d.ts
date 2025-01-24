interface RazorpayInstance {
  on(event: string, handler: (response: unknown) => void): void;
  open(): void;
}

interface Window {
  Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
}
