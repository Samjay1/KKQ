
         // REQUEST WITHDRAWAL PAGE - SHOW/HIDE PHONE OR BANK INPUTS
         const bank = document.getElementById('bank')
         const phone = document.getElementById('phone')
         const payment_method = document.getElementById('payment_method')
 
         payment_method.addEventListener('change', (e)=>{
             if(e.target.value==='bank'){
                 bank.style.display= 'block'
                 phone.style.display = 'none'
 
             }else if(e.target.value==='mobile'){
                 phone.style.display = 'block'
                 bank.style.display = 'none'
             }else{
                 bank.style.display = 'none'
                 phone.style.display = 'none'
             }
             console.log('e :>> ', e);
             console.log('value :>> ', e.target.value);
         })
        