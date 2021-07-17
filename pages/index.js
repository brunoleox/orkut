import React, { useState, useEffect } from 'react';
import MainGrid from '../src/components/MainGrid'
import Box from '../src/components/Box'
import jwt from 'jsonwebtoken'
import nookies from 'nookies'
import { AlurakutMenu, OrkutNostalgicIconSet, AlurakutProfileSidebarMenuDefault } from '../src/lib/AlurakutCommons';
import { ProfileRelationsBoxWrapper } from '../src/components/ProfileRelations';

function ProfileSidebar(propriedades) {
  return (
    <Box>
      <img src={`https://github.com/${propriedades.githubUser}.png`} style={{ borderRadius: '8px' }} />
      <hr />

      <a className="boxLink" href={`https://github.com/${propriedades.githubUser}`} >
        @{propriedades.githubUser}
      </a>
      <hr />

      <AlurakutProfileSidebarMenuDefault />
    </Box>
  )
}


export default function Home(props) {

  const user = props.githubUser
  const [comunidades, setComunidades] = React.useState([])



  const pessoasFavoritas = [
    'filipedeschamps',
    'omariosouto',
    'peas',
    'rafaballerini',
    'marcobrunodev',
    'felipefialho'
  ]

  const [seguidores, setSeguidores] = useState([])

  // Comunicação com a API do Github de Seguidores.
  useEffect(() => {
    fetch(`https://api.github.com/users/${user}/followers`)
      .then((respostaDoServidor) => {
        return respostaDoServidor.json()
      })
      .then((respostaCompleta) => {

        setSeguidores(respostaCompleta)
      })

    // Comunicação com o Dato
    fetch('https://graphql.datocms.com/ ', {
      method: 'POST',
      headers: {
        'Authorization': 'd33f97abf64e83a045f65d5b25830a',
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        "query": `query {
            allCommunities {
              id
              title
              imageUrl
            }
          }`
      })
    })
      .then((response) => response.json())
      .then((resCompleta) => {
        const comunidades = resCompleta.data.allCommunities
        setComunidades(comunidades)
      })
  }, [])

  function ProfileRelationsBox(props) {
    return (

      <ProfileRelationsBoxWrapper>
        <h2 className="smallTitle">
          {props.title} {props.items.length}
        </h2>

        <ul>
          {props.items.slice(0, 6).map((itemAtual) => {

            return (
              <li key={itemAtual.login}>
                <a href={`${itemAtual.html_url}`}>
                  <img src={itemAtual.avatar_url} />
                  <span>{itemAtual.login}</span>
                </a>
              </li>
            )
          })}
        </ul>
        <button className="button" >Ver Mais</button>

      </ProfileRelationsBoxWrapper>
    )
  }

  return (
    <>
      <AlurakutMenu />

      <MainGrid>
        {/* <Box style="grid-area: profileArea;"> */}
        <div className="profileArea" style={{ gridArea: 'profileArea' }}>
          <ProfileSidebar githubUser={user} />
        </div>
        <div className="welcomeArea" style={{ gridArea: 'welcomeArea' }}>
          <Box>
            <h4 className="title" >
              Bem Vindo, {user}
            </h4>
            <p className="sort">Sorte de hoje: O melhor profeta do futuro é o passado</p>

            <OrkutNostalgicIconSet />

          </Box>

          <Box>
            <h2 className="subTitle">O que você deseja fazer?</h2>

            <form onSubmit={(e) => {
              e.preventDefault()
              const dadosForm = new FormData(e.target)

              const comunidade = {

                title: dadosForm.get('title'),
                imageUrl: dadosForm.get('image')
              }

              fetch('/api/comunidades', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(comunidade)
              })
                .then(async (response) => {
                  const dados = await response.json()
                  console.log(dados)
                })

              // const comunidadesAtualizadas = [...comunidades, comunidade]
              // setComunidades(comunidadesAtualizadas)

            }} >

              <div>
                <input
                  placeholder="Qual vai ser o nome da sua comunidade?"
                  name="title"
                  aria-label="Qual vai ser o nome da sua comunidade?"
                  type="text"
                />
              </div>
              <div>
                <input
                  placeholder="Coloque uma URL para usarmos de capa"
                  name="image"
                  aria-label="Coloque uma URL para usarmos de capa?"
                  type="text"
                />
              </div>

              <button className="button" > Criar comunidade </button>

            </form>
          </Box>
        </div>


        <div className="profileRelationsArea" style={{ gridArea: 'profileRelationsArea' }}>

          {/* Seguidores */}

          <ProfileRelationsBox title="Seguidores" items={seguidores}>


          </ProfileRelationsBox>

          {/* Seguidores */}

          <ProfileRelationsBoxWrapper>
            <h2 className="smallTitle">
              Pessoas da comunidade ({pessoasFavoritas.length})
            </h2>

            <ul>
              {pessoasFavoritas.map((itemAtual) => {
                return (
                  <li key={itemAtual}>
                    <a href={`/users/${itemAtual}`}>
                      <img src={`https://github.com/${itemAtual}.png`} />
                      <span>{itemAtual}</span>
                    </a>
                  </li>
                )
              })}
            </ul>
          </ProfileRelationsBoxWrapper>

          <ProfileRelationsBoxWrapper>
            <h2 className="smallTitle">
              Comunidades ({comunidades.length})
            </h2>

            <ul>
              {comunidades.map((itemAtual) => {
                return (
                  <li key={itemAtual.id}>
                    <a href={`/comunities/${itemAtual.id}`}>
                      <img src={itemAtual.imageUrl} />
                      <span>{itemAtual.title}</span>
                    </a>
                  </li>
                )
              })}
            </ul>
          </ProfileRelationsBoxWrapper>

        </div>
      </MainGrid>
    </>
  )
}

export async function getServerSideProps(context) {
  const cookies = nookies.get(context)
  const token = cookies.USER_TOKEN
  const decodedToken = jwt.decode(token)
  const githubUser = decodedToken?.githubUser

  if (!githubUser) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      }
    }
  }


  return {
    props:
    {
      githubUser
    }
  }
}