const submitName = () => {
    const newName = document.getElementById('newName').value;
    const newSuperName = document.getElementById('newSuperName').value;
    const newImageUrl = document.getElementById('imageUrl').value;
    
    fetch('/proveAssignments/11/insert', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ newName, newSuperName, newImageUrl })
    })
    .then(res => {
        document.getElementById('newName').value = '';
        document.getElementById('newSuperName').value = '';
        document.getElementById('imageUrl').value = '';
        const socket = io();
        socket.on('update-list', () => {
                console.log('made it')
                populateList();
            })
        socket.emit('newSuper');
        populateList();
        
    })
    .catch(err => {
        document.getElementById('newName').value = '';
        document.getElementById('newSuperName').value = '';
        document.getElementById('imageUrl').value = '';
        console.log(err);
    })
}

const populateList = () => {
    const nameList = document.getElementById('nameList');
    fetch('/proveAssignments/11/fetchAll')
        .then(res => res.json())
        .then(data => {
            while (nameList.firstChild) nameList.firstChild.remove()
            for (const avenger of data.avengers) {
                if(avenger.name) {
                    const li = document.createElement('li');
                    li.classList.add('card');
                    li.classList.add('avenger');
                    const img = document.createElement('img');
                    img.classList.add('card__image');
                    const h3 = document.createElement('h3');
                    h3.classList.add('product__title');
                    h3.appendChild(document.createTextNode(avenger.name));
                    img.src = avenger.imageUrl;
                    const h4 = document.createElement('h4');
                    h4.classList.add('card__content');
                    h4.appendChild(document.createTextNode(avenger.superName));
                    li.appendChild(h3);
                    li.appendChild(img);
                    li.appendChild(h4);
                    nameList.appendChild(li);
                }
            }
            
        })
        .catch(err => {
            console.log(err);
        })
}

populateList();