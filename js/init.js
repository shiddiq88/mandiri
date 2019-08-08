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

let daftarHarga={};
var partReff = db.ref("/part");
partReff.on('value', function(snapshot){
	let part = snapshot.val()
	let tempObj = {}
	
	let arrayCart = Object.keys(tempObj)
	console.log(arrayCart)
	Object.keys(part).forEach(function(item,index){
		let spart = part[item]
		Object.keys(spart).forEach(function(item2,index2){
		let harga = IDR(spart[item2]).format(true);
		$('#'+item).append(
			` <tr>
                  <td id="`+item2.split(' ').join('-')+`" class="desc">`+ item2 +`</td>
                  <td>`+ harga +`</td>
                  <td class="btnList"><a href=""></a><i class="material-icons orange-text partList">add_circle</i></td>
               </tr>
			`)
		daftarHarga[item2]=spart[item2];
		})
	})
})


// ui keranjang
let cartReff = db.ref("/cart")
cartReff.on('value', function(snapCart){
	let cart = (snapCart.exists()) ? snapCart.val() : []
	let jmlCart = cart.length == 0 ? '' : Object.keys(cart).length
	let total=0
	$('#list-keranjang').empty()
	$('#count-cart').text(jmlCart)
	Object.keys(cart).forEach(function(item){
			$('#list-keranjang').append(
			` <tr>
                  <td class='desc'>`+ item +`</td>
                  <td class='qty'>`+ cart[item] +`</td>
                  <td>`+ IDR(daftarHarga[item]).format(true)+`</td>
                  <td> `+ IDR(cart[item]*daftarHarga[item]).format(true) +`</td>
                  <td><a href=""></a><i class="material-icons red-text hapus" >cancel</i></td>
               </tr>
			`)
	total += cart[item]*daftarHarga[item]
	$('#'+item.split(' ').join('-')).siblings('.btnList').html('<a href=""></a><i class="material-icons green-text" >check_circle</i>')
	console.log($('#'+item.split(' ').join('-')).siblings('.btnList').html())
	})	
	$("#total-belanja").text( IDR(total).format(true) )
})

// tambah cart
$(document).on('click','.partList', function(){
	let namaPart =$(this).parent().siblings(".desc").text() 
	let jml = prompt("masukan jumlah barang!")
	db.ref('/cart/'+namaPart).set(parseInt(jml))
})

// hapus cart
$(document).on('click','.hapus', function(){
	let namaPart =$(this).parent().siblings(".desc").text() 
	db.ref('/cart/'+namaPart).set(null)
	let selectorDecs = $(this).parents('td').siblings('.desc').text()
	$('#'+selectorDecs.split(' ').join('-')).siblings('.btnList').html('<a href=""></a><i class="material-icons orange-text partList">add_circle</i>')

})

// ubah Qty
$(document).on('click','.qty', function(){
	let namaPart =$(this).siblings(".desc").text() 
	let jml = prompt("rubah Qty "+namaPart)
	db.ref('/cart/'+namaPart).set(parseInt(jml))
})

// aktivasi materializ css
M.AutoInit();
