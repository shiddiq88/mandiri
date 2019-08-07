// firebase init
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
var db = firebase.database();

// funtion currency to IDR
var IDR = value => currency(value, { symbol: 'Rp ', decimal: ',', separator: '.' });
// daftar spare part
let daftarHarga={};
var partReff = db.ref("/part");
partReff.on('value', function(snapshot){
	let part = snapshot.val()
	Object.keys(part).forEach(function(item,index){
		let spart = part[item]
		Object.keys(spart).forEach(function(item2,index2){
		let harga = IDR(spart[item2]).format(true);
		$('#'+item).append(
			` <tr>
                  <td id="`+item2+`">`+ item2 +`</td>
                  <td>`+ harga +`</td>
                  <td><a href=""></a><i class="material-icons red-text">add_circle</i></td>
               </tr>
			`)
		daftarHarga[item2]=spart[item2];
		})
	}) 
console.log(daftarHarga)
// ui keranjang
let cartReff = db.ref("/cart")
cartReff.on('value', function(snapCart){
	let cart = (snapCart.exists()) ? snapCart.val() : []
	let jmlCart = item.length == 0 ? '' : Object.keys(item).length
	$('#count-'+item).text(jmlCart)
		Object.keys(item).forEach(function(item2){
			$('#list-keranjang').append(
			` <tr>
                  <td>`+ item2 +`</td>
                  <td>`+ 2 +`</td>
                  <td><a href=""></a><i class="material-icons red-text">add_circle</i></td>
               </tr>
			`)
// console.log(cart[item])
// console.log(item)
// console.log(item2)

		})	
	})
})



// aktivasi collapsible materializ css
M.AutoInit();
// $(document).ready(function(){
//   $('.collapsible').collapsible();
//   $('.tabs').tabs();
//   });

