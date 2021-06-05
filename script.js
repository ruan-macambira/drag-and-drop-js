function onDragStart(event) {
    event.dataTransfer
         .setData('text/plain', event.target.id);
}

function onDragOver(event) {
    event.preventDefault();
}

function onDrop(event) {
    event.preventDefault();
    const id = event.dataTransfer.getData('text/plain');
    const draggableElement = document.getElementById(id);
    const dropzone = event.target.closest('.board')
                          .querySelector('.card-container');
    
    if(event.target.classList.contains('card')) {
        dropzone.insertBefore(draggableElement, event.target);
    } else {
        dropzone.appendChild(draggableElement);
    }
}

function buildElement(
    tag,
    {
        classList = [], attributes = {},
        events = [], children = [],
        ...rest
    } = {}
) {
    let element = document.createElement(tag);

    for(klass of classList) {
        element.classList.add(klass);
    }

    for(let attr in attributes) {
        const value = attributes[attr];
        element.setAttribute(attr, value);
    }

    for(let ev in events) {
        const callback = events[ev];
        element[ev] = callback;
    }

    for(child of children) {
        element.appendChild(child);
    }

    for(prop in rest) {
        element[prop] = rest[prop];
    }

    return element;
}

function Board(header=null) {
    return buildElement(
        'div', {
            classList: ['board'],
            events: {
                ondragover: onDragOver,
                ondrop: onDrop
            }, children: [
                BoardHeader(header),
                CardContainer(),
                AddCardButton()
            ],
            // attributes: {draggable: true}
        }
    )
}

function BoardHeader(header=null) {
    return buildElement(
        'h3', {
            classList: ['board-header'],
            innerHTML: header || "[Board Text]",
        }
    )
}

function CardContainer() {
    return buildElement(
        'div', {classList:['card-container']}
    )
}

function Card() {
    if(!this.counter) { this.counter = 0 }
    this.counter += 1;

    return buildElement(
        'div', {
            id: `drag-card=${this.counter}`,
            classList: ['card'],
            attributes: {draggable: true},
            events: {ondragstart: onDragStart},
            innerHTML: `[Card ${this.counter} Text]`
        }
    )
}

function addCard({target, ..._}) {
    const board = target.closest('.board').querySelector('.card-container');
    board.appendChild(Card());
}

function AddCardButton() {
    return buildElement(
        'div', {
            classList: ['new-card'],
            innerHTML: "+ Adicionar outro item",
            events: { onclick: addCard }
        }
    )
}

function BoardFormTextForm() {
    return buildElement(
        'input', {
            placeholder: 'Insira Título da Lista',
            attributes: { required: true }
    })
}

function BoardFormApplyButton() {
    return buildElement(
        'button', {
            classList: ['apply-button'],
            attributes: {href: '#'},
            innerHTML: 'Criar'
    })
}

function BoardFormCancelButton() {
    return buildElement(
        'button', {
            classList: ['cancel-button'],
            attributes: {href: '#', type: 'button'},
            innerHTML: 'Cancelar',
            onclick: event => {
                const boardForm = event.target.closest('.board-form');
                boardForm.remove();
            }
    })
}

function BoardForm() {
    const boardFormTextForm = BoardFormTextForm();
    return buildElement(
        'form', {
            classList: ['board-form'],
            children: [
                boardFormTextForm,
                BoardFormApplyButton(),
                BoardFormCancelButton()
            ], onsubmit: event => {
                BoardContainer.insertBefore(Board(boardFormTextForm.value), AddBoardButton);
                event.target.remove();
                return false;
            }
    });
}

function addBoard(event) {
    const boardForm = BoardForm();
    BoardContainer.insertBefore(boardForm, event.target);
    boardForm.querySelector('input').focus();
}

const AddBoardButton = buildElement(
    'a', {
        innerHTML: "+ Adicionar Outra Lista",
        classList: ['new-board'],
        id: 'new-board-button',
        events: { onclick: addBoard }
    })

const BoardContainer = buildElement(
    'a', {
        classList: ['board-container'],
        id: 'board-container',
        children: [AddBoardButton]
    })

window.onload = () => {
    document.body.appendChild(BoardContainer);
    window.addEventListener('click', event => {
        let boardForm = document.querySelector('.board-form');

        if(boardForm) {
            AddBoardButton.setAttribute('hidden', null);
        } else {
            AddBoardButton.removeAttribute('hidden');
        }
    })
};
