const client = require("twilio")(
  process.env.Account_SID,
  process.env.Auth_Token
);

const OtpSend = async (phonenumber: string) => {
  await client.verify.v2
    .services(process.env.Service_SID)
    .verifications.create({ to: phonenumber, channel: "sms" });
};

const OtpVerfiy = async (phonenumber: string, code: string) => {
  return await client.verify.v2
    .services(process.env.Service_SID)
    .verificationChecks.create({ to: phonenumber, code });
};

export { OtpSend, OtpVerfiy };
