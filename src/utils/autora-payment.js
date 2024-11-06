exports.paymentObject = {
  zeroCostProcessingOptionId: 1,
  zeroCostProcessingOption: "None",
  availableCurrencies: [
    {
      id: 1,
      name: "USD",
    },
  ],
  availableCardTypes: [
    {
      id: 0,
      name: "Unknown",
    },
    {
      id: 1,
      name: "Visa",
    },
    {
      id: 2,
      name: "MasterCard",
    },
    {
      id: 3,
      name: "AmericanExpress",
    },
    {
      id: 4,
      name: "DinersClub",
    },
    {
      id: 5,
      name: "Discover",
    },
    {
      id: 6,
      name: "JCB",
    },
  ],
  availableTransactionTypes: [
    {
      id: 2,
      name: "Sale",
    },
    {
      id: 3,
      name: "Capture",
    },
    {
      id: 5,
      name: "Refund",
    },
    {
      id: 4,
      name: "Void",
    },
    {
      id: 6,
      name: "CardAuthentication",
    },
    {
      id: 7,
      name: "RefundWORef",
    },
  ],
  isTipsEnabled: false,
  availablePaymentProcessors: [
    {
      id: "766842f6-a54d-4f88-8c8c-e80f7ca68ab8",
      name: "D7 Systems",
      isDefault: false,
      typeId: 1,
      type: "Tsys",
      settlementBatchTimeSlots: [
        {
          hours: 5,
          minutes: 0,
          timezoneName: "America/Chicago",
        },
      ],
    },
  ],
  avs: {
    isEnabled: true,
    profileId: 2,
    profile: "Moderate",
  },
};
