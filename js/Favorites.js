import { GithubUser } from "./GithubUser.js";




export class Favorites{
  constructor(root) {
    this.root = document.querySelector(root)

    this.load()
  }
  load() {
    this.entries = JSON.parse(localStorage.getItem('@github-favorites:')) || []
  }

  save(){
    localStorage.setItem('@github-favorites:', JSON.stringify(this.entries))
  }

  async add(username) {
    try{
      const userExists = this.entries.find(entry => entry.login === username)

      if(userExists){
        throw new Error('Usuário já cadastrado')
      }

      const user = await GithubUser.search(username)

      if(user.login === undefined){
        throw new Error('Usuário não encontrado')
      }

      this.entries = [user, ...this.entries]
      this.update()

    } catch(error){
      alert(error.message)
    }
  }

  delete(user) {
    const filteredEntries = this.entries.filter(entry =>entry.login!==user.login)
    this.entries = filteredEntries
    this.update()
    this.save()
  }
}


export class FavoritesView extends Favorites{
  constructor(root){
    super(root)

    this.tbody = this.root.querySelector('table tbody')

    this.update()
    this.onadd()
  }

  onadd(){
    const addButton = this.root.querySelector('.search button')
    addButton.onclick = () =>{
      const {value} = this.root.querySelector('.search input') //irá pegar a referência do input

      this.add(value) //irá adicionar o que foi escrito no input
    }
  }

  update() {
    this.removeAllTr()

    this.entries.forEach(user=>{
      const row = this.createRow()

      row.querySelector('.user img').src = `https://github.com/${user.login}.png`
      row.querySelector('.user img').alt = `Imagem do ${user.name}`
      row.querySelector('.user a').href = `https://github.com/${user.login}`
      row.querySelector('.user p').textContent = user.name
      row.querySelector('.user span').textContent = user.login
      row.querySelector('.repositories').textContent = user.public_repos
      row.querySelector('.followers').textContent = user.followers
      row.querySelector('.action').addEventListener('click', ()=>{
        const isOk = confirm('Tem certeza que deseja deletar esta linha?')

        if(isOk){
          this.delete(user) //se clicar no ok, então ele irá deletar a linha
        }
      })
      
      this.tbody.append(row)
    })

  }

  createRow(){
    const tr = document.createElement('tr')

    tr.innerHTML /*innerHTML pois será procurado na web */=`
      <td class="user">
        <img src="https://github.com/Icsilva01.png" alt="Imagem do github de icaro silva">
        <a href="https://github.com/Icsilva01" target="_blank">
          <p>Icaro silva</p>
          <span>/Icsilva01</span>
        </a>
      </td>
      <td class="repositories">15</td>

      <td class="followers">6</td>

      <td class="action">
         <button>Remover</button>
         </td>
    ` 

    return tr
  } //criando as tr pelo JS
  
  removeAllTr() {
    this.tbody.querySelectorAll('tr')
    .forEach(tr => {
      tr.remove()
    })//irá selecionar TODOS os tr
  }
}


