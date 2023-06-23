const app = document.getElementById("app")
const canal = "trycatch_tv"
const esMiCanal = "trycatch_tv" === canal
const habilitarVoz = true

// Elementos
app.className =
  "margin-0 p-0 bg-purple-900 text-white min-h-screen flex flex-col "
const titulo = document.createElement("h1")
titulo.innerHTML = `Twitch: ${canal} `
titulo.className = "text-4xl font-bold text-center mt-4"
app.appendChild(titulo)
const contenedor = document.createElement("div")
contenedor.className = "flex flex-row items-center justify-center mt-8"
app.appendChild(contenedor)
const izquierda = document.createElement("div")
const tituloIzquierda = document.createElement("h2")
tituloIzquierda.innerHTML = "Usuarios"
tituloIzquierda.className =
  "text-2xl font-bold text-center mt-4 text-purple-500"
izquierda.appendChild(tituloIzquierda)
izquierda.className =
  "flex flex-col items-center w-2/6 mx-auto h-screen overflow-y-hidden"
const centro = document.createElement("div")
centro.className = "flex flex-col items-center w-2/6 mx-auto  h-screen"
const tituloCentro = document.createElement("h2")
tituloCentro.innerHTML = "Raids"
tituloCentro.className = "text-2xl font-bold text-center mt-4 text-purple-500"
centro.appendChild(tituloCentro)
const derecha = document.createElement("div")
derecha.className = "flex flex-col items-center w-2/6 mx-auto  h-screen"
const tituloDerecha = document.createElement("h2")
tituloDerecha.innerHTML = "Mensajes"
tituloDerecha.className = "text-2xl font-bold text-center mt-4 text-purple-500"
derecha.appendChild(tituloDerecha)
contenedor.appendChild(izquierda)
contenedor.appendChild(centro)
contenedor.appendChild(derecha)
const userContent = document.createElement("ul")
userContent.className =
  "flex flex-col items-center bg-purple-800 p-4 mt-4 w-2/4 mx-auto rounded-md"
izquierda.appendChild(userContent)

let users = []
const client = new window.tmi.Client({
  channels: [canal],
  connection: {
    secure: true,
    reconnect: true,
  },
  // identity: {
  //   username: "trycatch_tv",
  //   password: [TOKEN],
  // },
  // options: {
  //   debug: false,
  // },
})

client.connect()

client.on("message", (channel, tags, message, self) => {
  if (self) return
  const username = tags.username
  const esSub = tags.subscriber
  if (message) {
    if (!users.some((user) => user.username === username)) {
      users.push(tags)
      if (esSub) {
        speak(`Bienvenido ${username}, gracias por ser sub!`)
      }
      userContent.innerHTML = ""
      users.forEach((user) => {
        let li = document.createElement("li")
        li.innerHTML = `@${user.username}`
        li.className =
          "text-2xl p-2 rounded-md w-5/6 mt-4 text-center bg-gray-100 text-gray-400"
        if (user.subscriber) {
          li.className += " text-yellow-800 bg-yellow-100 underline"
        }
        userContent.appendChild(li)
      })
    }
  }

  if (esSub) {
    if (esMiCanal) {
      client.say(channel, `@${tags.username}, bueno verlo de nuevo por aqui!`)
    }
  }

  if (message.toLowerCase() === "!hola") {
    if (esMiCanal) {
      client.say(channel, `@${tags.username}, heya!`)
    }
  }
})

client.on("raided", (channel, username, viewers, tags) => {
  console.log(`Raid from: ${channel}/${username} with ${viewers} viewers`)
  if (esMiCanal) {
    client.say(channel, `@${username} Gracias por el raid!`)
  }
  speak(`Gracias por el raid ${username}, le debo una!`)
})

function speak(message) {
  if (!habilitarVoz) return
  var msg = new SpeechSynthesisUtterance(message)
  msg.lang = "es-ES"
  window.speechSynthesis.speak(msg)
}
