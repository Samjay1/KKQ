
        const notification_items = document.querySelectorAll('.notification-item');
        const drop_content = document.querySelectorAll('.drop-content');
        const viewState = document.querySelectorAll('.viewState');
         

        notification_items.forEach((button,index)=>{
            button.addEventListener('click', ()=>{
            console.log('clicked', index, drop_content[index].className.split(' ')[0] )
            
            if(drop_content[index].className.split(' ')[0] === 'truncate'){
                drop_content[index].className = 'drop-content'
            }else{
                drop_content[index].className = 'truncate drop-content'
                drop_content[index].style.color = 'black'
                
            }
        });
        })


        viewState.forEach((button,index)=>{
            
            button.addEventListener('click', ()=>{
            console.log('clicked', index, drop_content[index].className.split(' ')[0] )
            
            if(drop_content[index].className.split(' ')[0] === 'truncate'){
                drop_content[index].className = 'drop-content'
                
            }else{
                drop_content[index].className = 'truncate drop-content'
                drop_content[index].style.color = 'black'
                
                 
            }
        });
        })