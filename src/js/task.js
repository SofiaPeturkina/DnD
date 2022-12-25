export default class TaskShow {
    constructor(input) {
        this.input = document.querySelector(`${input}`)
        this.addTask()
        this.listTask = [...document.querySelectorAll('.list-task')]
        this.deleteTask()
        this.showBtnClose()
        this.dragged()
        this.setState()
        this.parseState()
    }

    addTask() {
        this.input.addEventListener('change', () => {
            let text = this.input.value
            if (!text) return
            const taskItem = `<li class="item-task">
                          <span>${text}</span>
                          <button class="close">&#9587;</button>
                          </li>`

            this.listTask[0].insertAdjacentHTML('beforeend', taskItem)
            this.input.value = ''
        })
    }


    deleteTask() {
        this.listTask.forEach(item => {
            item.addEventListener("click", (e) => {
                if (e.target.closest('.close')) {
                    let element = e.target
                    element.closest('.item-task').remove()
                } else return
            })
        })
    }

    showBtnClose() {
        document.addEventListener("mouseover", (e) => {
            const close = [...document.querySelectorAll('.close')]
            let element = e.target.closest('.item-task')
            close.forEach(item => {
                item.classList.remove('close_active')
            })
            if (element) {
                let close = element.querySelector('.close')
                close.classList.add('close_active')
            }
        })
    }

    dragged() {

        let acutalElement;
        let axis;
        let x;
        let y;

        const onmouseOver = (e) => {
            acutalElement.style.top = e.clientY - x + 'px'
            acutalElement.style.left = e.clientX - y + 'px'
        }

        const onMouseUp = (e) => {


            acutalElement.classList.remove('item-task_drugged')
            acutalElement.classList.remove('cursor')
            const mouseUpItem = e.target.closest('.list-task')
            if (mouseUpItem != null) {
                mouseUpItem.append(acutalElement)
            }
            document.querySelectorAll('*').forEach((el) => el.style.cursor = '');
            acutalElement = undefined
            document.removeEventListener('mouseover', onmouseOver)
            document.removeEventListener('mouseup', onMouseUp)
        }

        document.addEventListener('mousedown', (e) => {
            if (!e.target.closest('.list-task')) {
                return
            }

            if (e.target.closest('.close')) {
                return
            }
            e.preventDefault()
            if (e.target.closest('.item-task')) {
                acutalElement = e.target.closest('.item-task')

                axis = acutalElement.getBoundingClientRect()
                x = e.clientY - axis.top
                y = e.clientX - axis.left
                document.querySelectorAll('*').forEach((el) => el.style.cursor = 'grabbing');
                acutalElement.classList.add('item-task_drugged')
                acutalElement.classList.add('cursor')
                document.addEventListener('mouseover', onmouseOver)
                document.addEventListener('mouseup', onMouseUp)
            }
        })

    }

    setState() {
        window.addEventListener('unload', () => {
            let state = {}
            for (let i = 0; i < this.listTask.length; i++) {
                let item = [...this.listTask[i].querySelectorAll('span')]
                let content = item.map(text => text.textContent)
                state[i] = content
            }
            localStorage.setItem("item", JSON.stringify(state))
        })
    }

    parseState() {
        window.addEventListener('load', () => {
            let parse = JSON.parse(localStorage.getItem('item'))

            for (let key in parse) {
                // this.listTask[key].append(task)
                let arrText = parse[key]
                arrText.forEach(item => {
                    const task = `<li class="item-task">
                          <span>${item}</span>
                          <button class="close">&#9587;</button>
                          </li>`
                    this.listTask[key].innerHTML += task
                    localStorage.clear()
                })
            }
        })
    }
}

const task = new TaskShow('.text-task')