const fs = require('fs');
const sinon = require('sinon-es6');
const Robe = require('Robe');

before(() => {
  console.log('before');
  // mock database
  sinon.stub(Robe, 'connect').returns({
    collection() {
      return {
        store: {},

        ensureIndexes() {
          return {};
        },
        insert(obj) {
          if (!obj || !obj.name || !obj.email || !obj.token) {
            throw new Error();
          }
          this.store[obj.email] = obj;
        },
        find() {
          return [].from(this.store);
        },
        findOne(obj) {
          if (!obj || !obj.email) {
            throw new Error();
          }
          return this.store[obj.email];
        },
      };
    },
  });

  // test keys
  const publicKey = `
    MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC2FyNDl1hdP+RwI0G06EmGZIdN
    O5xVu+GTxcG8x1elFvqnJ3fwIZ2eL5wVB9eP/hYSqiEwbpRmGApVaIMDLpEHhPxr
    8mkWncXsC3cDSwKUzM4PCldhWbHPPAaJ18YuJNaVc9OHxoql4S3SYdw19dpLmORn
    CZZrPjgMCb9ZGA+qqQIDAQAB`;
  const privateKey = `
    MIICXQIBAAKBgQC2FyNDl1hdP+RwI0G06EmGZIdNO5xVu+GTxcG8x1elFvqnJ3fw
    IZ2eL5wVB9eP/hYSqiEwbpRmGApVaIMDLpEHhPxr8mkWncXsC3cDSwKUzM4PCldh
    WbHPPAaJ18YuJNaVc9OHxoql4S3SYdw19dpLmORnCZZrPjgMCb9ZGA+qqQIDAQAB
    AoGBAJ7HgEWBJFlzzEOIStRwNSTOZjkPgNw1j5cmuzBc9u0LI5g8T1aCSYnVZBnm
    k66I1kCCP5yW4CpCTkh5cLyGj4jw44CaL0j1wJ6pyr/JECnrTThVa+JHTgeN8whd
    xmgMUH7NibYFYyXTHFeVZy3ldIxhDIzi5RJxIkFPc8AVT/dxAkEA5J3SZGBF/yIC
    0em1EEXuTWHY+LvZetdRovuJDcUI61zEpY4LhnCHcd5nTR2TTv67KqBkljc9Xg07
    zXAnqbc+dQJBAMvmqcytwF4Es5Z7IijDwnwTZPIZ2+LP5+DSmkExFUzu4MRFPtRB
    8BGqleT5dzENvL7XhoubZeEve9XYcGEQHOUCQQDB28ZtkWmpmBiWEbyU6QfTHHbV
    LM2VKgKy1uL4By2yDz89N780KDXia/pi3QJuCPmDgvDopDzohQZCBanMc3OFAkAb
    dbMEZ5nyj3uIFokhKEv23b3IhQcB4rH9qx8vDGcr9ze59wFhIIguOOT680XEC2+R
    3AC4qHLuArEQuZdY2wypAkAM+PWe8AJiEbpqyWtxK1ym+gFuWe0Ktzl/vmtdHUuY
    uVOrEM6j+bMTAdoWkXWZjDhJas6Wql7EzRNsP52dTDab`;
  // mock the readFileSync function
  sinon.stub(fs, 'readFileSync', (param) => {
    if (param.includes('.pub')) {
      return publicKey;
    }
    return privateKey;
  });
});

after(() => {
  console.log('after');
  fs.readFileSync.restore();
  Robe.connect.restore();
});
