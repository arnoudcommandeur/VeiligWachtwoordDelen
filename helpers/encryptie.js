// TweetNaCl
keyReciever = nacl.box.keyPair();
keySender = nacl.box.keyPair();

nonce = nacl.randomBytes(nacl.box.nonceLength);  
cipher = nacl.box(nacl.util.decodeUTF8("test"), nonce, keyReciever.publicKey, keySender.secretKey);

plain = nacl.box.open(cipher, nonce, keySender.publicKey, keyReciever.secretKey);

nacl.util.encodeUTF8(plain);

// Web Crypto

window.crypto.subtle.generateKey(
{
    name: "ECDSA",
    namedCurve: "P-384"
},
false,
["sign", "verify"]
).then((keyPair) => {
    
    console.log(keyPair); 
}
)

