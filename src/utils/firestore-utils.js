//----------------------------------------------------------------------------------------------------------------------

import Vue from 'vue';
import Vuex from 'vuex';

//----------------------------------------------------------------------------------------------------------------------

Vue.use(Vuex);

//----------------------------------------------------------------------------------------------------------------------

function nop (value) { } // A place holder function that does nothing...
function defError(error) { console.error(error) }

//----------------------------------------------------------------------------------------------------------------------

function tokens(string,split,flatten) {
  let flat = (flatten === undefined) ? true : flatten;
  if (flat === true) {
    return string.split(split).filter(function(e) { return e !== ''})
  }
  else
  {
    return string.split(split)
  }
}

window.tokens = tokens;

function splitFirst(text,split,encapsulate) {
  let enc = (encapsulate === undefined) ? true : encapsulate;
  let pad = (enc === true) ? split : '';
  let tokens = text.split(split).filter(function(e) {return e !== ''});
  let first  = tokens[0];
  let restTokens = tokens.splice(1);
  let rest = pad + restTokens.join(split) + pad;
  return [first,rest];
}

window.splitFirst = splitFirst;

function splitLast(text,split,encapsulate) {
  let enc = (encapsulate === undefined) ? true : encapsulate;
  let pad = (enc === true) ? split : '';
  let tokens = text.split(split).filter(function(e) {return e !== ''});
  let last  = tokens[tokens.length-1];
  tokens.splice(tokens.length -1);
  let rest = pad + tokens.join(split) + pad;
  return [rest,last];
}


function splitBetween(text,before,after) {
  let beforeAndAfter = splitFirst(text,before,false);
  let beforePart = beforeAndAfter[0];
  let afterPart  = beforeAndAfter[1];
  let middleAndAfter = splitLast(afterPart,after,false);
  let middle = middleAndAfter[0];
  let adterOnly = middleAndAfter[1];
  return [beforePart,middle,adterOnly];
}


window.splitBetween = splitBetween;

function cleanJoin(arrayoftext,split,encapsulate) {
  let text = (typeof(arrayoftext) === 'object') ? arrayoftext.join(split) : arrayoftext;
  let enc = (encapsulate === undefined) ? true : encapsulate;
  let pad = (enc === true) ? split : '';
  return pad + text.split(split).filter(function(e) {return e !== ''}).join(split) + pad;
}

window.splitLast = splitLast;


function clone(obj) {
  let res = {};
  for (var f in obj) {
    if (obj.hasOwnProperty(f)) {
      if (obj[f] !== undefined) {
        if (f !== '.key') {
          res[f] = obj[f]
        }
      }
    }
  }
  return res;
}

//----------------------------------------------------------------------------------------------------------------------

function getID(prefix) {
  let pfx = (prefix !== undefined) ? '' : prefix;
  let date = new Date();
  let random = Math.round(Math.random() * 1000000);
  let remainingDigits = 6 - Math.floor(Math.log10(random)) + 1;
  let pad = "0".repeat(remainingDigits);
  let zzz = date.getMilliseconds();
  let ss = date.getSeconds();
  let mm = date.getMinutes();
  let hh = date.getHours();
  let D  = date.getDate();
  let M  = date.getMonth();
  let Y  = date.getFullYear();
  let miniID = Math.floor(Math.random() * 1000);
  let resID = pfx + Date.UTC(Y, M, D,hh,mm,ss,zzz) + miniID +pad + random;
  resID = resID.toLocaleLowerCase();
  return resID;
}

//----------------------------------------------------------------------------------------------------------------------

function updateFirestoreField(path,fieldPath,value) {
    let object = {};
    let field = fieldPath.join('.');
    object[field] = value;
    let document = path.splice(path.length -1)[0];
    let collection = path.join('/');
    let addRef = window.db.collection(collection).doc(document).update(object);
    return object;
}

//----------------------------------------------------------------------------------------------------------------------

function linkRecords(pathA,pathB) {
   let collectionA = pathA[0];
   let collectionB = pathB[0];
   let keyA = pathA[1];
   let keyB = pathB[1];
   let fieldA = pathA[2];
   let fieldB = pathB[2];
   updateFirestoreField([collectionA,keyA],[fieldA,keyB],true);
   updateFirestoreField([collectionB,keyB],[fieldB,keyA],true);
}

//----------------------------------------------------------------------------------------------------------------------

function linkRecord(path,value) {
    let collection = path[0];
    let key        = path[1];
    let field      = path[2];
    updateFirestoreField([collection,key],[field,value],true);
 }

//----------------------------------------------------------------------------------------------------------------------

function unlinkRecords(pathA,pathB) {
  let collectionA = pathA[0];
  let collectionB = pathB[0];
  let keyA = pathA[1];
  let keyB = pathB[1];
  let fieldA = pathA[2];
  let fieldB = pathB[2];
  updateFirestoreField([collectionA,keyA],[fieldA,keyB],false);
  updateFirestoreField([collectionB,keyB],[fieldB,keyA],false);
}

//----------------------------------------------------------------------------------------------------------------------

function unbindCollection(collection) {

}

function bindToQuery(state, fieldInState, collection, objectInCollection, value,callback) {
  window.db.collection(collection).where(objectInCollection + '.' + value, '==', true).onSnapshot(
    function (snapshot) {
      snapshot.docChanges().forEach(function (change) {
        let data = change.doc.data();
        let key = change.doc.id;
        data['.key'] = key;
        data.id = key;
        // console.log('DATA:',data);

        if (callback !== undefined) {
          callback(change.type,data);
        }
        if (change.type === "added") {
          Vue.set(state[fieldInState], key, data);
        } else
        if (change.type === "modified") {
          Vue.set(state[fieldInState], key, data);
        } else
        if (change.type === "removed") {
          Vue.delete(state[fieldInState], key);
        }
      });
    });
}

//----------------------------------------------------------------------------------------------------------------------

function createFirestoreRecord(path, key, value, callback,error) {
  let err = (error === undefined) ? defError : error;
  let cbf = (callback === undefined) ? nop : callback;
  let collection = path.join('/');
  let cln = clone(value);
  let addRef = window.db.collection(collection).doc(key).set(cln).then(cbf).catch(err);
  return addRef;
}

//----------------------------------------------------------------------------------------------------------------------

function updateFirestoreRecord(path, key, value, callback,error) {
  let err = (error === undefined) ? defError : error;
  let cbf = (callback === undefined) ? nop : callback;
  let collection = path.join('/');
  let cln = clone(value);
  let addRef = window.db.collection(collection).doc(key).update(cln).then(cbf).catch(err);
  return addRef;
}

//----------------------------------------------------------------------------------------------------------------------

function bindToFirestoreCollection(fieldname, path, callback,error) {
  let err = (error    === undefined) ? defError : error;
  let cbf = (callback === undefined) ? nop : callback;
  let collection = path.join('/');
  window.app.$binding(fieldname, window.db.collection(collection)).then(cbf).catch(err);
  return fieldname;
}

//----------------------------------------------------------------------------------------------------------------------

function bindToFirestoreRecord(fieldname, path, callback,error) {
    let cbf = (callback === undefined) ? nop      : callback;
    let err = (error    === undefined) ? defError : error;
    let document   = path.splice(path.length - 1)[0];
    let collection = path.join('/');
    let ref = window.db.collection(collection).doc(document);
    let res = window.app.$binding(fieldname,ref).then(cbf).catch(err);
    return fieldname;
}

//----------------------------------------------------------------------------------------------------------------------

function deleteFirestoreRecord(path, key) {
  let collectionPath = path.join('/');
  // console.log('collectionPath:',collectionPath);
  window.db.collection(collectionPath).doc(key).delete();
  return key;
}

//----------------------------------------------------------------------------------------------------------------------

function joinPath(state, path, currentPath) {
    if (path.length === 0) {
        if (typeof currentPath === "string") {
            return [currentPath]
        }
        else {
          return currentPath;
        }
    }
    else {
        let root = path[0];
        if (root[0] === "{") {
            let bracketField = root.split(/{|}/)[1];
            let field = state[bracketField];
            return joinPath(state, path.splice(1), currentPath + '/' + field);
        }
        else
            if (root[0] === "[") {
                let subPaths = root.split(/\[|\]/)[1].split(',');
                return subPaths.map(function (p) { return joinPath(state, path.splice(1), currentPath + '/' + p).join('/') })
            }
            else
                if (root[0] === "*") {
                    return joinPath(state, path.splice(1), currentPath + '/' + '*')
                } else {
                    return joinPath(state, path.splice(1), currentPath + '/' + root);
                }
    }
}

//----------------------------------------------------------------------------------------------------------------------

function getPath(state, path) {
    var tokens = path.split('/').filter(function (p) { return (p !== '') });
    return joinPath(state, tokens, '');
}

//----------------------------------------------------------------------------------------------------------------------

function recurseToObject(object, fields) {
    if (fields.length === 0) {
        return object
    } else {
        let f = fields[0];
        if (object[f] === undefined) {
            let emptyObject = {};
            Vue.set(object, f, emptyObject);
            let remainingFields = fields.splice(1);
            return recurseToObject(object[f], remainingFields);
        }
        else {
            let remainingFields = fields.splice(1);
            return recurseToObject(object[f], remainingFields)
        }
    }
}

//----------------------------------------------------------------------------------------------------------------------

function doBindCollection(state, dbPath, localPath, callback) {
  let object = recurseToObject(state, localPath.split('/').filter(function (p) { return (p !== '') }));
  let collection = dbPath;
  window.db.collection(collection).onSnapshot(
    function (snapshot) {
      snapshot.docChanges().forEach(function (change) {
        let data = change.doc.data();
        let key = change.doc.id;
        data['.key'] = key;
        data.id = key;
        // console.log('DATA:',data);
        if (callback !== undefined) {
          callback(change.type, data);
        }
        if (change.type === "added") {
          if (object[key] === undefined) {
            Vue.set(object, key, data)
          }
          else {
            for (var af in data) {
              if (data.hasOwnProperty(af)) {
                Vue.set(object[key], af, data[af])
              }
            }
          }
        } else
        if (change.type === "modified") {
          if (object[key] === undefined) {
            Vue.set(object, key, data)
          }
          else {
            for (var mf in data) {
              if (data.hasOwnProperty(mf)) {
                Vue.set(object[key], mf, data[mf])
              }
            }
          }
        } else
        if (change.type === "removed") {
          Vue.delete(object, key);
        }
      });
    },function(error) {
      // console.log('SOME ERROR OCURRED:',error);
    },function(param) {
      // console.log('SOMETHING ELSE HAPPENED:',param);
    });
  }

//----------------------------------------------------------------------------------------------------------------------

function doBindDocument(state,dbPath,localPath,callback) {
  let traversePath = localPath.split('/').filter(function (p) { return (p !== '') });
  // console.log('traversePath',traversePath);
  traversePath.splice(traversePath.length - 1);
  let object = recurseToObject(state, traversePath);
  // console.log('OBJECT',object);
  let dbPathSegments = dbPath.split('/').filter(function (p) { return (p !== '') });
  let docPath      = dbPathSegments.splice(dbPathSegments.length -1)[0];
  let collection = dbPathSegments.join('/');
  window.db.collection(collection).doc(docPath).onSnapshot(
    function (doc,anotherParam) {
      // console.log('DOC1:',doc);
        let data = doc.data();
        // console.log('data:',data);
        // window.app.$binding('wtf',ref)
        let key = doc.id;
        data['.key'] = key;
        data.id = key;
        for (var mf in data) {
          if (data.hasOwnProperty(mf)) {
            Vue.set(object, key, data)
          }
        }
      });
}

function doBindDocumentCollection(state, dbPath, localPath) {
  let beforeDBPath = dbPath[0];
  let beforeLocalPath = localPath[0];
  let afterDBPath = dbPath.splice(1);
  let afterLocalPath = localPath.splice(1);
  let bindFunction = function (action, data) {
    if (action === "added") {
      let id = data.id;
      let fullDBPath = beforeDBPath + id + afterDBPath.join('*');
      let fullLocalPath = beforeLocalPath + id + afterLocalPath.join('*');
      bindCollection(state, fullDBPath , fullLocalPath )
    }
    else
    {
      nop()
    }
  }
  doBindCollection(state, beforeDBPath, beforeLocalPath, bindFunction);
}

//----------------------------------------------------------------------------------------------------------------------

function bindCollection(state, dbPath, localPath) {
  let globDBPath = dbPath.split(/\*/);
  let globLocalPath = localPath.split(/\*/);
  if (globDBPath.length === 1) {
    doBindCollection(state, dbPath, localPath)
  }
  else {
    doBindDocumentCollection(state, globDBPath, globLocalPath)
  }
}

//----------------------------------------------------------------------------------------------------------------------

function bindRecursive(state, path,callback) {
  // console.log('BIND RECURSIVE START:',path);
  xbindRecursive(state, path.state,path.db,callback);
  // var dbPaths    = getPath(state, path.db);
  // var statePaths = getPath(state, path.state);
  // console.log('dbPaths:',dbPaths);
  // let paths      = [];
  // for (var i = 0; i < dbPaths.length; i++) {
  //   let pathRec = { 'db': dbPaths[i], 'state': statePaths[i] };
  //   xbindRecursive(state, statePaths[i],dbPaths[i]);
  //   paths.push(pathRec);
  // }
  // return paths;
}

//----------------------------------------------------------------------------------------------------------------------

const TST =
{
  db:"/clients/{client_id}!/events/?client_id={client_id}&accessibility=public/data/*/detail",
  state:"/client!/events/?/data/*/whatever"
};

//----------------------------------------------------------------------------------------------------------------------

function xjoinPathsAndContinue(state,key,paths,call) {
  if (!(paths.db.after === '' || paths.db.after === '/')) {
    // console.log('xjoinPathsAndContinue => paths.db.after:',paths.db.after);
    let dbPath = [paths.db.before,key,paths.db.after].join('/').split('/').filter(function(e) {return e !== ""} ).join('/');
    let stPath = [paths.st.before,key,paths.st.after].join('/').split('/').filter(function(e) {return e !== ""} ).join('/');
    stPath = '/'+stPath+'/';
    dbPath = '/'+dbPath+'/';
    xbindRecursive(state,stPath,dbPath,call);
  }
}

function xbindAndContinue(state,paths,call) {
  if (paths.type === "doc") {
    xbindDocAndContinue(state,paths,call)
  }
  else
  if (paths.type === "query") {
    xbindQueryAndContinue(state,paths,call)
  }
  else
  {
    xbindCollectionAndContinue(state,paths,call)
  }
}


function xbindQueryAndContinue(state,paths,call) {
  let object = recurseToObject(state, paths.st.before.split('/').filter(function (p) { return (p !== '') }));
  var docRef = paths.col.collection.get().then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
      let data = doc.data();
      let key = doc.id;
      data['.key'] = key;
      data.id = key;
      if (object[key] === undefined) {
        Vue.set(object, key, data)
      }
      else {
        for (var af in data) {
          if (data.hasOwnProperty(af)) {
            Vue.set(object[key], af, data[af])
          }
        }
      }
      xjoinPathsAndContinue(state,key,paths,call)
    })
  })
}

function xbindDocAndContinue(state,paths,call) {
  // console.log('xbindDocAndContinue:paths',paths);
  let object = recurseToObject(state, paths.st.before.split('/').filter(function (p) { return (p !== '') }));
  var docRef = window.db.collection(paths.col.path).doc(paths.doc);
  docRef.get().then(function(doc) {
    if (doc.exists) {
      let data = doc.data();
      // console.log("Document data:", data);
      let key = doc.id;
      if (object[key] === undefined) {
        Vue.set(object, key, data)
      }
      else {
        for (var af in data) {
          if (data.hasOwnProperty(af)) {
            Vue.set(object[key], af, data[af])
          }
        }
      }
      xjoinPathsAndContinue(state,key,paths,call)
    } else {
        // console.log("No such document!");
    }
}).catch(function(error) {
    // console.log("Error getting document:", error);
});

}

function xbindCollectionAndContinue(state,paths,call) {
  // console.log('xbindCollectionAndContinue:',paths);
  let stPath = paths.st.before.split('/').filter(function (p) { return (p !== '') });
  let object = recurseToObject(state, stPath);
  let collection = paths.col.collection;
  paths.col.collection.onSnapshot(
    function (snapshot) {
      snapshot.docChanges().forEach(function (change) {
        let data = change.doc.data();
        // console.log('DATA:',data);
        let key = change.doc.id;
        data['.key'] = key;
        data.id = key;
        if (call !== undefined) {
          call({data:data,change:change.type,id:key,paths:paths})
        }
        if (change.type === "added") {
          if (object[key] === undefined) {
            Vue.set(object, key, data)
          }
          else {
            for (var af in data) {
              if (data.hasOwnProperty(af)) {
              Vue.set(object[key], af, data[af])
            }
          }
        }
        xjoinPathsAndContinue(state,key,paths,call)
      } else
      if (change.type === "modified") {
        if (object[key] === undefined) {
          Vue.set(object, key, data)
        }
        else {
          for (var mf in data) {
            if (data.hasOwnProperty(mf)) {
              Vue.set(object[key], mf, data[mf])
            }
          }
        }
      } else
      if (change.type === "removed") {
        Vue.delete(object, key);
      }
    });
  },function(error) {
    // console.log('SOME ERROR OCURRED:',error);
  },function(param) {
    // console.log('SOMETHING ELSE HAPPENED:',param);
  });
}


function xreplacePath(st,path) {
  // console.log('st',st);
	let tokens = path.split('{');
  // console.log('tokens',tokens);
  let paths = [];
	for (var i = 0 ; i < tokens.length ; i ++ ) {
  	let token = tokens[i];
    // console.log('\n\n');
    // console.log('token',token)
    let v = token.split("}");
    // console.log('v',v);

    if (v.length === 1) {
			  paths.push(v[0])
    }
    else
    {
    		let state_var = v[0];
        // console.log('state_var',state_var);
    		paths.push(st[state_var]);
        paths.push(v[1])
    }
  }
  // console.log('paths:',paths);
  return paths.join('');
}


function xbindDocument(state,stpath,dbPath,call) {
  console.error('BINDING TO DOCUMENT NOT YET IMPLEMENTED!!!',dbPath,stpath);
}

function xbindCollection(state,stpath,dbPath,call) {
  // console.log('BINDING TO COLLECTION');
  doBindCollection(state, dbPath, stpath)
}

function xbindFull(state,stpath,dbpath,call) {
  let tokens = dbpath.split('/').filter(function(e) { return e !== ""});
  // console.log('TOKENS FOR FULL BIND: ',tokens);
  if (tokens.length % 2 === 0) {
    // console.log('FULL BINDING: DOCUMENT');
    xbindDocument(state,stpath,dbpath,call);
  }
  else
  {
    // console.log('FULL BINDING: COLLECTION');
    xbindCollection(state,stpath,dbpath,call);
  }
}



function xbuildQueryObject(querystring) {
  var queryParts = querystring.split('&');
  // console.log('queryParts:',queryParts);
  let res = [];
  for (var q in queryParts) {
    let queryPart = queryParts[q];
    // console.log('queryPart:'+queryPart);
    let tokens = queryPart.split(/<|>|=|==|<=|>=|!=/);
    // console.log('tokens:'+tokens);
    let field  = tokens[0];
    // console.log('field:'+field);
    let value  = tokens[tokens.length -1];
    // console.log('value:'+value);
    let operator = queryPart.split(new RegExp(field+"|"+value)).filter(function(e) {return e !== "" })[0];
    // console.log('operator:'+operator);
    operator = (operator === '=') ? '==' : operator;
    let query = {field,value,operator};
    res.push(query)
  }
  return res;
}

function xsplitPaths(state,character,stPath,dbPath) {
  // console.log('xsplitPaths:stPath',stPath);
  let stPathTokens = stPath.split(character);
  // console.log('xsplitPaths:stPathTokens',stPathTokens);
  let firstStPath   = stPathTokens[0];
  // console.log('xsplitPaths:firstStPath',firstStPath);
  let restStPath  = stPathTokens.splice(1).join(character);
  // console.log('xsplitPaths:restStPath',restStPath);

  let dbPathTokens = dbPath.split(character);
  let firstDBPath  = dbPathTokens[0];
  let restDBPath   = dbPathTokens.splice(1).join(character);
  let collection   = firstDBPath;
  let db = {};
  let st = {};
  let col = {};
  let pathSections = collection.split('/').filter(function(e) {return e !== ""}).length;
  let type = (pathSections % 2 === 0 ) ? 'doc' : 'collection';

  db.before = firstDBPath;
  db.after  = restDBPath;
  st.before = firstStPath;
  st.after  = restStPath;
  let doc ;
  // console.log('collection path',collection);
  if (type === "collection") {
    col.path  = collection;
    col.collection = window.db.collection(collection);
  } else
  {
    let tokens = collection.split('/').filter(function(e) {return e !== ""});
    doc = tokens[tokens.length -1];
    let coltokens = tokens.splice(tokens.length -1);
    col.path = tokens.join('/');
  }
  return {db,st,col,type,doc};
}


function xbindQuery(state,stpath,dbpath,call) {
  // console.log('BINDING:'+'xbindQuery');
  let paths = xsplitPaths(state,'?',stpath,dbpath);
  // console.log('paths:',paths);
  let queryPart   = paths.db.after.split('/')[0];
  let lastPath = paths.db.after.split('/').splice(1).join('/');
  // console.log('lastPath:',lastPath);
  let queryObject  = xbuildQueryObject(queryPart);
  // console.log('queryObject:',queryObject);
  // console.log('query collection:',paths.col.path);
  let collectionRef = window.db.collection(paths.col.path);
  let ref = collectionRef;
  for (var q in queryObject) {
    let query = queryObject[q];

    ref = ref.where(query.field,query.operator,query.value);
  }

  paths.col.collection = ref;
  paths.db.after = lastPath;
  paths.type = 'query';
  xbindAndContinue(state,paths);
}

function xbindBind(state,stpath,dbpath,call) {
  let paths = xsplitPaths(state,'!',stpath,dbpath);
  xbindAndContinue(state,paths,call);
}

function xbindList(state,stpath,dbpath,call) {
  // console.log('XBIND LIST: ST:',stpath,'DB:',dbpath);
  let paths = xsplitPaths(state,'*',stpath,dbpath);
  xbindAndContinue(state,paths,call);
}

function xbindExpand(state,stpath,dbpath,call) {
  let stTokens = splitFirst(stpath,']',false);
  let stFirst = stTokens[0];
  let stAfter = stTokens[1];
  let stBeforeAndExpand = splitFirst(stFirst,'[',false);
  let stBefore = stBeforeAndExpand[0];
  let stExpand = stBeforeAndExpand[1];
  let stExpandTokens = stExpand.split(',');

  let dbTokens = splitFirst(dbpath,']',false);
  let dbFirst = dbTokens[0];
  let dbAfter = dbTokens[1];
  let dbBeforeAndExpand = splitFirst(dbFirst,'[',false);
  let dbBefore = dbBeforeAndExpand[0];
  let dbExpand = dbBeforeAndExpand[1];
  let dbExpandTokens = dbExpand.split(',');


  for (var i = 0 ; i < stExpandTokens.length ; i ++ ) {
    let stx = stExpandTokens[i];
    let dbx = dbExpandTokens[i];
    let st = cleanJoin([stBefore,stx,stAfter],'');
    let db = cleanJoin([dbBefore,dbx,dbAfter],'');
    // console.log('ABOUT TO RECURSE:ST:'+st+' TO DB:'+db);
    xbindRecursive(state,st,db,call)
  }
}

window.xbindExpand = xbindExpand;

function replaceState(state,path) {
  if (path.indexOf('{') === -1) {
    return path;
  } else
  {
  let beforeReplaceAfter = splitBetween(path,"{","}");
  // console.log('beforeReplaceAfter:',beforeReplaceAfter);
  let before = beforeReplaceAfter[0];
  let replace = beforeReplaceAfter[1];
  let after = beforeReplaceAfter[2];
  return before + state[replace] + after
}
}


function xbindRecursive(state,stPath,dbPath,call) {
  // console.log('STATE',state.client_id);
  // console.log('stPath:',stPath);
  // console.log('dbPath:',dbPath);
  let stpath = replaceState(state,stPath);
  let dbpath = replaceState(state,dbPath);
  // console.log('stpath:',stpath);
  // console.log('dbpath:',dbpath);
  let bindPosition   = stpath.indexOf('!');
  let listPosition   = stpath.indexOf('*');
  let queryPosition  = stpath.indexOf('?');
  let expandPosition = stpath.indexOf('[');

  let positions     = {};
  if (bindPosition   !== -1) { positions[bindPosition]   = 'BIND' }
  if (listPosition   !== -1) { positions[listPosition]   = 'LIST' }
  if (queryPosition  !== -1) { positions[queryPosition]  = 'QUERY'}
  if (expandPosition !== -1) { positions["0"] = 'EXPAND'}

  let max = 99999999;
  let min = max;
  // console.log('POSITIONS:',positions);
  for (var p in positions) {
    // console.log('P:',p);
    if (p*1 < min) {
      // console.log('MIN WAS:',min,"is now :",p);
      min = p;
    }
  }
  // console.log('MIN:',min);
  let bindType = 'FULL';
  if (min !== max) {
    bindType = positions[min];
  }
  // console.log('bindType:',bindType);
  if (bindType === 'FULL') {
    xbindFull(state,stpath,dbpath,call)
  } else
  if (bindType === 'QUERY') {
    xbindQuery(state,stpath,dbpath,call)
  } else
  if (bindType === 'LIST') {
    xbindList(state,stpath,dbpath,call)
  } else
  if (bindType === 'EXPAND') {
    xbindExpand(state,stpath,dbpath,call)
  } else
  if (bindType === 'BIND') {
    xbindBind(state,stpath,dbpath,call)
  }
}

function xtst(state) {
  let db = "/[events,persons,places]/?owner=[ACTE/EO/Trooptravel]/data";
  let st = "/[events,persons,places]/public/?[ACTE/EO/Trooptravel]/data";
  xbindRecursive(state,st,db)
}

window.tst = xtst;

window.xbindRecursive = xbindRecursive;

window.deleteFirestoreRecord     = deleteFirestoreRecord;
window.bindToFirestoreRecord     = bindToFirestoreRecord;
window.bindToQuery               = bindToQuery;
window.createFirestoreRecord     = createFirestoreRecord;
window.updateFirestoreField      = updateFirestoreField;
window.updateFirestoreRecord     = updateFirestoreRecord;
window.bindToFirestoreCollection = bindToFirestoreCollection;
window.getID                     = getID;
window.linkRecords               = linkRecords;
window.unlinkRecords             = unlinkRecords;
window.linkRecord                = linkRecord;
window.bindRecursive             = bindRecursive;
window.recurseToObject           = recurseToObject;
window.doBindDocument            = doBindDocument;

//----------------------------------------------------------------------------------------------------------------------
