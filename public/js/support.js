
        const drop_button = document.querySelectorAll('.menu-button');
        const drop_content = document.querySelectorAll('.drop-content');
        const symbol = document.querySelectorAll('#symbol');

        drop_button.forEach((button,index)=>{
            drop_content[index].style.display = 'none'
            
            console.log('index',index)
            button.addEventListener('click', ()=>{
            console.log('clicked', index)
            // drop_content.style.display = 'none'
            if(drop_content[index].style.display === 'none'){
                drop_content[index].style.display = 'block'
                symbol[index].innerHTML =  `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
  <path stroke-linecap="round" stroke-linejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
</svg>`

            }else{
                drop_content[index].style.display = 'none'
                
symbol[index].innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
  <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
</svg>`
            }
        });
        })

        