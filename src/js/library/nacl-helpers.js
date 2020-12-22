/* 
** You'll need to generate a key pair for your users e.g.
** const keypair = nacl.box.keyPair()
** const receiverPublicKey = nacl.util.encodeBase64(keypair.publicKey)
** const receiverSecretKey = nacl.util.encodeBase64(keypair.secretKey)
**
*/

/* encrypted message interface */
// interface IEncryptedMsg {  
//   ciphertext: string  
//   ephemPubKey: string  
//   nonce: string  
//   version: string
// }
/* This function encrypts a message using a base64 encoded
** publicKey such that only the corresponding secretKey will
** be able to decrypt
*/
function encrypt(receiverPublicKey, msgParams) {
  const ephemeralKeyPair = nacl.box.keyPair()  
  //const pubKeyUInt8Array = nacl.util.decodeBase64(receiverPublicKey)  
  const pubKeyUInt8Array = receiverPublicKey  
  const msgParamsUInt8Array = nacl.util.decodeUTF8(msgParams)  
  const nonce = nacl.randomBytes(nacl.box.nonceLength)
  const encryptedMessage = nacl.box(
     msgParamsUInt8Array,
     nonce,        
     pubKeyUInt8Array,
     ephemeralKeyPair.secretKey
  )  
  return {    
    ciphertext: nacl.util.encodeBase64(encryptedMessage),    
    ephemPubKey: nacl.util.encodeBase64(ephemeralKeyPair.publicKey),
    nonce: nacl.util.encodeBase64(nonce),     
    version: "x25519-xsalsa20-poly1305"  
  }
  
}
// /* Decrypt a message with a base64 encoded secretKey (privateKey) */
// function decrypt(receiverSecretKey: string, encryptedData: IEncryptedMsg) {  
//   const receiverSecretKeyUint8Array = nacl.util.decodeBase64(
//       receiverSecretKey
//   )      
//   const nonce = nacl.util.decodeBase64(encryptedData.nonce)      
//   const ciphertext = nacl.util.decodeBase64(encryptedData.ciphertext)      
//   const ephemPubKey = nacl.util.decodeBase64(encryptedData.ephemPubKey)      
//   const decryptedMessage = nacl.box.open(
//       ciphertext, 
//       nonce,          
//       ephemPubKey, 
//       receiverSecretKeyUint8Array
//   )
//   return nacl.util.encodeUTF8(decryptedMessage)        
// }