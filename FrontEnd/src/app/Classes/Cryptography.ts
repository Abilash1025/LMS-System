//Crypto JS Library
import * as CryptoJS from 'crypto-js';

export class Cryptography{

    private secretKey: string = "37383234363661376461646131333435";

    constructor(){}

    public EncryptData(data: any) {
      try {
        var key = CryptoJS.enc.Hex.parse(this.secretKey);
        var plaintText = data;
        var encryptedData = CryptoJS.AES.encrypt(plaintText, key, {
          mode: CryptoJS.mode.ECB,
          padding: CryptoJS.pad.Pkcs7
        });
        var enced = encryptedData.ciphertext.toString()
        return enced;
      } catch (e) {
        return null;
      }
    }

    public DecryptData(data: any) {
      try{
        var key = CryptoJS.enc.Hex.parse(this.secretKey);
        var dec = CryptoJS.AES.decrypt(CryptoJS.format.Hex.parse(data), key, {
          mode: CryptoJS.mode.ECB,
          padding: CryptoJS.pad.Pkcs7
        })
        return dec.toString(CryptoJS.enc.Utf8);
      }
      catch(e){
        return "";
      }
    }
}
