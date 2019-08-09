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
	})	
	$("#total-belanja").text( IDR(total).format(true) )
})

// event tombol tambah cart
$(document).on('click','.partList', function(){
	let namaPart =$(this).parent().siblings(".desc").text() 
	async function start() {
		const {value: number} = await Swal.fire({
		  title: 'Jumlah '+namaPart+' :',
		  input: 'text',
		  inputPlaceholder: 'masukan jumlah yang diinginkan!',
	 	  showCancelButton: true ,
  		  inputValidator : value => {
    		if (!value) {
		  	return 'jumlah tidak boleh kosong'
    	  	} else if (isNaN(value)) {
		  	return 'input mengandung karakter terlarang!'
		  	} 
  		}
	})

	if (number) {
		Swal.fire('berhasil menambah ' + namaPart+' sebanyak '+ number)
		db.ref('/cart/'+namaPart).set(parseInt(number))
	}}
	start()
})

// event tombol hapus cart
$(document).on('click','.hapus', function(){
	let namaPart =$(this).parent().siblings(".desc").text() 
	let selectorDecs = $(this).parents('td').siblings('.desc').text()
	Swal.fire({
	  title: 'Anda yakin?',
	  text: "apakah anda yakin menghapu "+namaPart+' dari cart',
	  type: 'warning',
	  showCancelButton: true,
	  confirmButtonColor: '#3085d6',
	  cancelButtonColor: '#d33',
	  confirmButtonText: 'ya, saya yakin!'
		}).then((result) => {
		  if (result.value) {
		    Swal.fire({
		    	type: 'success',   
				title: namaPart + 'telah dihapus dari cart',
				showConfirmButton: false,
				timer: 1500 })
				db.ref('/cart/'+namaPart).set(null)
				$('#'+selectorDecs.split(' ').join('-')).siblings('.btnList').html('<a href=""></a><i class="material-icons orange-text partList">add_circle</i>')
		  }
	})
})

// event tombol ubah Qty
$(document).on('click','.qty', function(){
	let namaPart =$(this).siblings(".desc").text() 
	let qty =$(this).text() 
	
	async function start() {
		const {value: number} = await Swal.fire({
		  title: 'Jumlah '+namaPart+' :',
		  input: 'text',
		  // inputPlaceholder: qty,
		  inputValue: qty,
	 	  showCancelButton: true ,
  		  inputValidator: (value) => {
    		if (!value) {
		  	return 'jumlah tidak boleh kosong'
    	  	} else if (isNaN(value)) {
		  	return 'input mengandung karakter terlarang!'
		  	} 
  		  }
		})

		if (number == 0) {
			db.ref('/cart/'+namaPart).set(null)
			Swal.fire({
			    	type: 'success',   
					title: 'berhasil menghapus ' + namaPart,
					showConfirmButton: false,
					timer: 1500 })

		} else if (number > 0){
			db.ref('/cart/'+namaPart).set(parseInt(number))
			Swal.fire({
			    	type: 'success',   
					title: 'berhasil merubah qty ' + namaPart+' menjadi '+ number,
					showConfirmButton: false,
					timer: 1500 })
		}
	}
	start()
})

// event tombol tambah data 
$(document).on('click','#btn-tambah-data',function(){
	let desc = $('#desc-tambah-data').val()
	let kategori = $('#kategori-tambah-data').val()
	let price = $('#price-tambah-data').val()
    if (desc == '' || price == '' ){
    	Swal.fire('Kesalahan input !','nama part atau harga tidak boleh kosong','error')
    } else if ( !desc.match(/^[A-Za-z]+$/) || isNaN(price) ) {
    	Swal.fire('Kesalahan input !','nama part atau harga mengandung karakter terlarang','error')
    } else {
	    Swal.fire({
		  title: 'Anda yakin?',
		  text: "apakah anda yakin menambah "+desc+' dengan kategori : '+kategori+' dan harga : '+IDR(price).format(true),
		  type: 'warning',
		  showCancelButton: true,
		  confirmButtonColor: '#3085d6',
		  cancelButtonColor: '#d33',
		  confirmButtonText: 'ya, saya yakin!'
			}).then((result) => {
			  if (result.value) {
			    Swal.fire({
			    	type: 'success',   
					title: desc+' dengan kategori : '+kategori+' dan harga : '+IDR(price).format(true)+' telah ditambahkan',
					showConfirmButton: false,
					timer: 1500 })
			  }
			db.ref('/part/'+kategori+'/'+desc).set(parseInt(price))
			window.location.reload()
		})
    }

})

// aktivasi materializ css
M.AutoInit();