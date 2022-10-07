export class GithubUser {
  static search(username) {
    const endpoint = `http://api.github.com/users/${username}`

    return fetch(endpoint)
    .then(data=>data.json())
    .then( ({login, name, public_repos, followers})=>{ /*procura esssas propriedades
    no endpoint do github e com o return irá retornar para minha página*/

      return{
        login,
        name,
        public_repos,
        followers
      }
    })//o fetch vai buscar na internet as coisas 
  }
}