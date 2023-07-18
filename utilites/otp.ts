const client = require("twilio")(
  "AC796018843aab82291cfdd2484cee2887",
  "9102a23e0cff05b5e4abe620e173b688"
);

const OtpSend = async (phonenumber: string) => {
  await client.verify.v2
    .services("VA469ab848f8466171525f40765920b2f3")
    .verifications.create({ to: phonenumber, channel: "sms" });
};

const OtpVerfiy = async (phonenumber: string, code: string) => {
  return await client.verify.v2
    .services("VA469ab848f8466171525f40765920b2f3")
    .verificationChecks.create({ to: phonenumber, code });
};

export { OtpSend, OtpVerfiy };
