
// const menu_button = document.querySelector('.mobile-menu-button');
// const sidebar = document.querySelector('.sidebar');

// menu_button.addEventListener('click', ()=>{
//     sidebar.classList.toggle('-translate-x-full');
// })




// INDEX.HTML CODE FOR NAV PROFILE IMAGE DROPDOWN
let profilebtn = document.querySelector('#profilebtn');
        let menulist = document.querySelector('#menulist')

        menulist.style.display = 'none'
        profilebtn.addEventListener('click', ()=>{
            console.log('profilebtn')
            if(menulist.style.display === 'none'){
                menulist.style.display = 'inline'
                console.log('show')
            }else{
                menulist.style.display = 'none'
                console.log('hide')
            }
        })
        
        // CLOSES MENULIST WHEN YOU CLICK ANYWHERE OUTSIDE
        window.onclick = (e)=>{
            console.log('id',e.target.id,e.target)
            if(e.target.id !== 'profileimg'){
                menulist.style.display = 'none'
            }
        }

        // INDEX.HTML CODE FOR MENU DROPDOWN
        // let menu = document.querySelector('#menu');
        // let menuItems = document.querySelector('#menuItems')

        // // menuItems.style.display = 'none'
        // menu.addEventListener('click', ()=>{
        //     console.log('menu')
        //     if(menuItems.style.display === 'none'){
        //         menuItems.style.display = 'inline'
        //         console.log('1')
        //     }else{
        //         menuItems.style.display = 'none'
        //         console.log('2')
        //     }
        // })
        
        // // CLOSES MENULIST WHEN YOU CLICK ANYWHERE OUTSIDE
        // window.onclick = (e)=>{
        //     if(e.target.id !== 'menu'){
        //         menuItems.style.display = 'none'
        //     }
        // }



       