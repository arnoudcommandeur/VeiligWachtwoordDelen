keyReciever = nacl.box.keyPair();
keySender = nacl.box.keyPair();

nonce = nacl.randomBytes(nacl.box.nonceLength);  
cipher = nacl.box(nacl.util.decodeUTF8("test"), nonce, keyReciever.publicKey, keySender.secretKey);

plain = nacl.box.open(cipher, nonce, keySender.publicKey, keyReciever.secretKey);

nacl.util.encodeUTF8(plain);