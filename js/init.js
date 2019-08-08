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
	// console.log($('#'+item.split(' ').join('-')).siblings('.btnList').html())
	})	
	$("#total-belanja").text( IDR(total).format(true) )
})

// event tombol tambah cart
$(document).on('click','.partList', function(){
	let namaPart =$(this).parent().siblings(".desc").text() 
	let jml = prompt("masukan jumlah barang!")
	db.ref('/cart/'+namaPart).set(parseInt(jml))
})

// event tombol hapus cart
$(document).on('click','.hapus', function(){
	let namaPart =$(this).parent().siblings(".desc").text() 
	db.ref('/cart/'+namaPart).set(null)
	let selectorDecs = $(this).parents('td').siblings('.desc').text()
	$('#'+selectorDecs.split(' ').join('-')).siblings('.btnList').html('<a href=""></a><i class="material-icons orange-text partList">add_circle</i>')

})

// event tombol ubah Qty
$(document).on('click','.qty', function(){
	let namaPart =$(this).siblings(".desc").text() 
	let jml = prompt("rubah Qty "+namaPart)
	if (isNaN(jml)) {
		alert('jml mengandung karakter terlarang')
	} else {
	db.ref('/cart/'+namaPart).set(parseInt(jml))	
	}
})

// event tombol tambah data 
$(document).on('click','#btn-tambah-data',function(){
	// document.location.href = '#!'
	let desc = $('#desc-tambah-data').val()
	let kategori = $('#kategori-tambah-data').val()
	let price = $('#price-tambah-data').val()
//	$('#modal1').close()
    if (desc == '' || price == '' ){
    	alert('nama part atau harga tidak boleh kosong')
    } else if ( !desc.match(/^[A-Za-z]+$/) || isNaN(price) ) {
    	alert('nama part atau harga mengaandung karakter terlarang')
    } else {
	    let conf = confirm('nama : '+desc+'\n kategori : '+kategori+'\n harga : '+price+'\n apakah anda yakin?')
	    if (conf) {
			db.ref('/part/'+kategori+'/'+desc).set(parseInt(price))
			window.location.reload()
	    } 	
    }

})



// aktivasi materializ css
M.AutoInit();
