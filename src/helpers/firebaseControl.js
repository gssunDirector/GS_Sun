import { getAuth, signOut } from "firebase/auth";
import { db, secondApp, storage } from "../firebase";
import {format} from 'date-fns';
import { ref, deleteObject } from 'firebase/storage';

export const auth = getAuth();
export const secondAuth = getAuth(secondApp)

export const logOut = () => {
    return new Promise((resolve, reject) => {
      signOut(auth)
        .then(() => {
          resolve(true);
        })
        .catch((error) => {
          reject(this._handleError(error));
        });
    });
  };

  export function  getCollection (collection)    {
    return new  Promise( function (resolve, reject) {
        db.collection(collection).get().then(res => {
            const data = [];
            res.forEach(doc => {
                data.push({
                    idPost: doc.id,
                    ...doc.data()
                })
            });
            resolve(data)
        }).catch(err => {
            reject(err);
        });
    });
};

export function getCollectionWhereKeyValue(collection, key, value) {
    return new Promise(function (resolve, reject) {
      db.collection(collection).where(key, '==', value).get().then(res => {
        const data = [];
        res.forEach(doc => {
          data.push({
            ...doc.data(),
            idPost: doc.id,
          });
        });
        resolve(data);
      }).catch(err => {
        reject(err);
      });
    });
  };

  export function updateDocumentInCollection(collection, document, idDocumnent) {
    return new Promise(function (resolve, reject) {
      try {
        db.collection(collection).doc(idDocumnent).update(document).then(r => {
          resolve({result: r});
        }).catch(e => {
          reject(e);
        });
      } catch (e) {
        reject(e);
      }
    });
  };

  export function setDocumentToCollection(collection, document) {
    return new Promise(function (resolve, reject) {
      try {
        db.collection(collection).add(document)
          .then(r => {
            updateDocumentInCollection(collection, {...document, idPost: r.id}, r.id)
              .then(res => console.log('success')).catch(e => console.log(e));
            resolve({result: r});
          }).catch(e => {
            reject(e);
          });
      } catch (e) {
        reject(e);
      }
    });
  };
  

export function createNewEmployee(uid, regInfo) {

    return new Promise(function (resolve, reject) {
    
      const employee_to_firebase_start = {
        uid,
        email: regInfo?.email || '',
        name: regInfo?.name || '',
        surname: regInfo?.surname || '',
        patronymic: regInfo?.patronymic || '',
        phoneNumber: regInfo?.phoneNumber || '',
        birthDate: regInfo?.birthDate || '',
        password: regInfo.password,
        dateCreating: format(new Date(), 'yyyy-MM-dd HH:mm'),
        role: regInfo.role,
        id: Math.floor(Date.now() * Math.random()).toString().slice(0, 5),
      };
      setDocumentToCollection('employees', employee_to_firebase_start).then(r => {
        console.log('employee saved in DB');
        resolve(r);
      }).catch(e => {
        reject(e);
      });
    });
  };

  export function downloadReciept(url, date) {
    const xhr = new XMLHttpRequest();
    xhr.responseType = 'blob';
    xhr.onload = (event) => {
      const blob = xhr.response;
      const fileURL = window.URL.createObjectURL(blob);
      let alink = document.createElement('a');
      alink.href = fileURL;
      alink.download = `receipt${date}.pdf`;
      alink.click();
    };
     xhr.open('GET', url);
    
    xhr.send();
  };

  export async function updateFieldInDocumentInCollection (collection, docId, fieldName, newValue) {

    let result;
  
    try {
      const docRef = db.collection(collection).doc(docId);
      result = await docRef.update({[fieldName]: newValue});
    } catch (error) {
      console.log(error.message);
    }
  
    return result;
  };

  export function createNewTransaction(type, id, sum, operator, location={}, info = {}) {

    console.log(operator);
  
      return new Promise(function (resolve, reject) {
      
        const transaction_to_firebase_start = {
          type,
          requestDate: Date.parse(new Date()),
          sum,
          location: Object.values(location).length > 0 ? `${location.adress}` : '',
          fuelType: info.fuelType || '',
          litrs: info.litrs || '',
          userNumber: id,
          uid: operator.uid,
        };
        setDocumentToCollection('transactions', transaction_to_firebase_start).then(r => {
          console.log('transaction saved in DB');
          resolve(r);
        }).catch(e => {
          reject(e);
        });
      });
    };

  export function createNewPriceChange(location, oldData, newData, uid) {
  
      return new Promise(function (resolve, reject) {
      
        const priceChange_to_firebase_start = {
          changeDate: format(new Date(), 'HH:mm:ss dd.MM.yyyy'),
          oldData,
          newData,
          uid
        };
        updateFieldInDocumentInCollection('locations', location.idPost, 'priceChanges', [...location.priceChanges, priceChange_to_firebase_start]).then(r => {
          console.log('priceChanges saved in DB');
          resolve(r);
        }).catch(e => {
          reject(e);
        });
      });
    };


    export function createNewPromotion(promotionInfo ,file) {
  
      const id = Math.floor(Date.now() * Math.random()).toString().slice(0, 5);

      storage.ref(`image${id}`).put(file).then(snapshot => {
        storage.ref().child(`image${id}`).getDownloadURL().then(url => {


    return new Promise(function (resolve, reject) {
      const promotion_to_firebase = {
        id,
        image: url,
        title: promotionInfo.title,
        promotionDate: promotionInfo.promotionDate,
        text: promotionInfo.text,
        isTop: promotionInfo.isTop,
        dateCreating: format(new Date(), 'HH:mm dd.MM.yyyy'),
        };
  
        setDocumentToCollection(`promotions`, promotion_to_firebase).then(r => {
          console.log('promotion saved in DB');

          resolve(r);
        }).catch(e => {
          reject(e);
        });
      });
    })
  })
};

    export function removeDocumentFromCollection(collection, docId) {
      return new Promise(function (resolve, reject) {
        try {
         
          db.collection(collection).doc(docId).delete()
            .then(r => {
              resolve(r);
            }).catch(e => {
              reject(e);
            });
        } catch (e) {
          reject(e);
        }
      });
    };

    

    export function deleteImageFromStorage (image) {
      return new Promise(function (resolve, reject) {
        deleteObject(ref(storage, image)).then((r) => {
          resolve(r);
        }).catch((error) => {
          reject(error);
        });
      });
    };

    export function uploadFileToStorage (file, id, idPost) {
      return new Promise(function (resolve, reject) {
        storage.ref(`image${id}`).put(file).then(res => {
         
          storage.ref().child(`image${id}`).getDownloadURL().then(r => {
            updateFieldInDocumentInCollection('promotions', idPost, 'image', r);
            console.log('updateUrl');
          }).catch(er => {
            alert(er);
          });
          resolve(res);
        }).catch(e => {
          reject(e);
        });
      });
    };

    
 

  