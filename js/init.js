// ======================================= firebase init ======================================= //
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

// ======================================= funtion currency to IDR ======================================= //

var IDR = value => currency(value, { symbol: 'Rp ', decimal: ',', separator: '.' });


// ======================================= aktivasi materializ css ======================================= //

M.AutoInit();

// =========================================== list barang =========================================== // 
let daftarHarga={};
var partReff = db.ref("/part");
partReff.on('value', function(snapshot){
	let part = snapshot.val()
	let tempObj = {}
	let arrayCart = Object.keys(tempObj)
	Object.keys(part).forEach(function(item,index){
		let spart = part[item]
		Object.keys(spart).forEach(function(item2,index2){
		let harga = IDR(spart[item2]).format(true);
		document.querySelector('#'+item).innerHTML += 
			` <tr>
                  <td id="`+item2.split(' ').join('-')+`" class="desc-part">`+ item2 +`</td>
                  <td class='price-part' data-harga=${spart[item2]}>`+ harga +`</td>
                  <td class="btnList"><i class="material-icons orange-text partList">add_circle</i></td>
               </tr>
			`
		daftarHarga[item2]=spart[item2];
		})
	})
})

// ======================================= Chart / keranjang ======================================= //
let cartReff = db.ref("/cart")
cartReff.on('value', function(snapCart){
	let cart = (snapCart.exists()) ? snapCart.val() : []
	let jmlCart = cart.length == 0 ? '' : Object.keys(cart).length
	if (jmlCart==0){
		document.querySelector('#clear-cart').style.display = 'none'
	} else {
		document.querySelector('#clear-cart').style.display = 'inherit'
	}
	let total=0
	document.querySelector('#list-keranjang').innerHTML = ''
	document.querySelector('#count-cart').innerText = jmlCart
	Object.keys(cart).forEach(function(item){
		document.querySelector('#list-keranjang').innerHTML += 
			` <tr>
                  <td class='desc'>`+ item +`</td>
                  <td class='qty'>`+ cart[item] +`</td>
                  <td>`+ IDR(daftarHarga[item]).format(true)+`</td>
                  <td> `+ IDR(cart[item]*daftarHarga[item]).format(true) +`</td>
                  <td><i class="material-icons red-text hapus" >cancel</i></td>
               </tr>`
		document.querySelector('#'+item.split(' ').join('-')).nextElementSibling.nextElementSibling.innerHTML = '<i class="material-icons green-text btn-check">check_circle</i>'
		total += cart[item]*daftarHarga[item]
	})	
	document.querySelector('#total-belanja').innerText = IDR(total).format(true)
})

document.querySelector('#list-keranjang').addEventListener('click' , e =>{
	switch (e.target.className) {
// ======================================= event tombol hapus cart ======================================= //
		case 'material-icons red-text hapus' :
			let namaPart =e.target.parentNode.nextSibling.parentNode.childNodes[1].innerText 
			Swal.fire({
			  title: 'Anda yakin?',
			  text: "apakah anda yakin menghapus "+namaPart+' dari cart',
			  type: 'warning',
			  showCancelButton: true,
			  confirmButtonColor: '#3085d6',
			  cancelButtonColor: '#d33',
			  confirmButtonText: 'ya, saya yakin!'
				}).then((result) => {
				  if (result.value) {
				    flashMessage(namaPart + 'telah dihapus dari cart')
				   	db.ref('/cart/'+namaPart).set(null)
					document.querySelector('#'+namaPart.split(' ').join('-')).nextElementSibling.nextElementSibling.innerHTML = '<i class="material-icons orange-text partList">add_circle</i>'
				  }
			})
 		break
/* ======================================= event tombol ubah Qty ======================================= */
		case 'qty' :
			let namaPart1 = e.target.previousElementSibling.innerText
			let qty = parseInt(e.target.innerText)
			
			async function start() {
				const {value: number} = await Swal.fire({
				  title: 'Jumlah '+namaPart1+' :',
				  input: 'text',
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
					db.ref('/cart/'+namaPart1).set(null)
					flashMessage( 'berhasil menghapus ' + namaPart1 )
				} else if (number > 0){
					db.ref('/cart/'+namaPart1).set(parseInt(number))
					flashMessage('berhasil merubah qty' + namaPart1+' menjadi '+ number )
				}
			}
			start()
		break
		default :
	}
})

/* ======================================= event tombol tambah data  ======================================= */
document.querySelector('#btn-tambah-data').addEventListener('click', e => {
	let desc = document.querySelector('#desc-tambah-data').value
	let kategori = document.querySelector('#kategori-tambah-data').value
	let price = document.querySelector('#price-tambah-data').value
    if (desc == '' || price == '' ){
    	Swal.fire('Kesalahan input !','nama part atau harga tidak boleh kosong','error')
    } else if ( !desc.match(/^[A-Za-z ]+$/) || isNaN(price) ) {
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
					flashMessage(desc+' dengan kategori : '+kategori+' dan harga : '+IDR(price).format(true)+' telah ditambahkan')
				}
			db.ref('/part/'+kategori+'/'+desc).set(parseInt(price))
			window.location.reload()
		})
    }

})

/* ======================================= event clear chart ======================================= */
document.querySelector('#clear-cart').addEventListener( 'click' , function(){
	Swal.fire({
	  title: 'Hapus seluruh isi chart?',
	  text: "yakin ? perubahan tidak bisa di undo",
	  type: 'warning',
	  showCancelButton: true,
	  confirmButtonColor: '#3085d6',
	  cancelButtonColor: '#d33',
	  confirmButtonText: 'Ya !'
	}).then((result) => {
		if (result.value) {
			db.ref('/cart').set(null)
			document.querySelectorAll(".btn-check").forEach(item=>{
				item.innerHTML = 'add_circle'
				item.className = 'material-icons orange-text partList'
			})
	   		flashMessage('Chart telah di kosongkan')
	  	}  
	})	
})

// ============================================ event List Part ============================================ //
document.querySelector('#list-part').addEventListener( 'click' , e => {
	switch (e.target.className) {
		/*  ===================================== event ubay key ===================================== */
		case 'desc-part' : 
		// despart = [ kategori , descripsi , harga ]
 			let descPart = [ e.target.parentNode.parentNode.id , e.target.innerText, parseInt(e.target.parentElement.childNodes[3].dataset.harga) ]
		 	Swal.fire({
		    	title:`Ubah / hapus ${descPart[1]}?`,
		    	input:"radio",
		    	showCancelButton: true,
		    	confirmButtonText: 'Next',
		    	inputOptions:{
		      		ubah : 'ubah',
		      		hapus : 'hapus'
		      		},
		      	inputValidator: (value) => {
		        	if (!value) {
		          		return 'masukan pilihan anda? (Ubah/Hapus)'
		        	}
		      	}
		  	}).then((result)=>{
		    	if (result.value == 'ubah'){
		      		Swal.fire({
		        		title: `Anda akan merubah : ${descPart[1]}`,
		        		showCancelButton: true,
		        		html:
		          			`<label for="swal-desc"> desc </label><input id="swal-desc" class="swal2-input" value="${descPart[1]}">`+
		           			`<label for="swal-price"> harga </label><input id="swal-price" class="swal2-input" value="${descPart[2]}">`,
				        focusConfirm: false,
				        preConfirm: () => {
		        			let desc = document.getElementById('swal-desc').value 
		          			let price = parseInt(document.getElementById('swal-price').value)
		          				if (desc == ''|| price == ''){
		            				Swal.showValidationMessage(`desc dan harga tidak boleh kosong`)
		          				} else if ( !desc.match(/^[A-Za-z ]+$/) || isNaN(price)){
		            				Swal.showValidationMessage(`input desc data harga mengandung karakter terlarang`)
		        	  			}
		          			return [ desc , price ]               
		        		} 
		    		}).then( (hasil) =>{
		        		if (hasil.value){
		          			swal.fire({
		            			type : 'question',
		            			text : `anda yakin merubah ${hasil.value[0]} menjadi harga ${IDR(hasil.value[1]).format(true)}`,
		            			showCancelButton: true
		          			}).then(result=>{
		            			if (result.value) {
		              				db.ref(`/part/${descPart[0]}/${hasil.value[0]}`).set(hasil.value[1])
		              				flashMessage('`horee berhasil merubah ${hasil.value[0]} menjadi harga ${IDR(hasil.value[1]).format(true)}`')
		              				window.location.reload()
		            			}
		          			})  
		    		    }
		    		})
		    	} else if ( result.value == 'hapus'){
		      		db.ref(`/part/${descPart[0]}/${descPart[1]}`).set(null)
		      		flashMessage(`${descPart[1]} berhasil dihapus`)
			      	window.location.reload()
		    	}
		  	})		
		break
		/*  ===================================== event add key ===================================== */
		case 'material-icons orange-text partList' : 
			let namaPart =e.target.parentNode.previousElementSibling.previousElementSibling.innerText 
			Swal.fire({
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
			}).then(result=>{
				if (result.value){
					db.ref('/cart/'+namaPart).set(parseInt(result.value))
					flashMessage( `${namaPart} telah ditambahkan sebanyak ${result.value}` )
				}
			})
		break 
		default :
			// console.log('kumahakeun yeuh....!')
	}
} )

const flashMessage = ( message , timer=1000 , type='success' ) => {
	swal.fire({	
		type : type , 
		text : message, 
		showConfirmButton: false, 
		timer: timer })
}