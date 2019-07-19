const firebaseConfig = {
  apiKey: "AIzaSyDIbhtaPL4HMKD5IdSMo2jVQRWKeXvqljg",
  authDomain: "bengkel-mandiri-dep.firebaseapp.com",
  databaseURL: "https://bengkel-mandiri-dep.firebaseio.com",
  projectId: "bengkel-mandiri-dep",
  storageBucket: "",
  messagingSenderId: "931944146437",
  appId: "1:931944146437:web:bb2ce70e03f3bca7"
};
 firebase.initializeApp(firebaseConfig);


var reff = firebase.database().ref("/part");
reff.once("value")
.then(function(snapshot){
	var data = snapshot.val();
	var key = Object.keys(data);
	key.forEach(function(item,index){
		let parts = data[item];
		let partsKeys = Object.keys(parts);
		let selector = '#'+item
		partsKeys.forEach(function(item2,index2){
		$(selector).append(
			` <tr>
                  <td>`+ item2 +`</td>
                  <td> RP. `+ parts[item2] +`</td>
                  <td><a href=""></a><i class="material-icons red-text">add_circle</i></td>
               </tr>
			`)
		})
	});
})

$(document).ready(function(){
    $('.collapsible').collapsible();
  });
