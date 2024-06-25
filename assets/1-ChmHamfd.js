const e={coverImageSrc:"https://raw.githubusercontent.com/TylorDev/Tylordev/public/Assets/Images/51943d9b-5acb-4d33-9e33-411e58c76901.webp",category:"Experimento",date:"20/06/2024",title:"Comunicacion entre pestañas",content:"localStorage",id:1},a="https://raw.githubusercontent.com/TylorDev/Tylordev/public/Assets/Images/85c76491-36ce-4fc5-bbd3-009a9b74fc9e.webp",s="Comunicando multiples pestañas en un mismo navegador, sin backend!  ",o=[{tittle:"Concepto Básico",paragraph:"Local Storage es una característica de HTML5 que permite almacenar datos de manera persistente en el navegador del usuario. A diferencia de las cookies, los datos en local storage no se envían al servidor con cada solicitud, y tienen un tamaño de almacenamiento mayor (generalmente 5MB).Para permitir que varias pestañas de una misma aplicación web se comuniquen entre sí, se puede utilizar el evento storage. Este evento se dispara en todas las pestañas cuando se produce un cambio en el local storage.",image:"https://raw.githubusercontent.com/TylorDev/Tylordev/public/Assets/Images/616f5b05-17dc-47af-b087-61311d2e8790.webp"},{tittle:"Entender el Proceso",paragraph:"Imagina que tienes una pizarra (local storage) en una sala de reuniones (el navegador). Cada vez que alguien en la sala (una pestaña) quiere compartir información con los demás, escribe un mensaje en la pizarra. Todos los presentes en la sala (otras pestañas) están observando la pizarra. Cuando alguien escribe algo nuevo, todos los demás lo ven y pueden reaccionar a ese cambio.",image:""},{tittle:"",paragraph:" 1. La Pizarra (Local Storage): Es un espacio donde cualquier pestaña puede escribir datos. Estos datos permanecen ahí hasta que alguien los borra o modifica.",image:""},{tittle:"",paragraph:"2. Personas Observando(Pestañas del Navegador): Todas las pestañas abiertas de la misma aplicación están constantemente observando la pizarra para detectar cualquier cambio.",image:""},{tittle:"",paragraph:"3. Evento de Cambio (storage): Cuando alguien escribe en la pizarra, todas las personas en la sala reciben una notificación inmediata de que algo ha cambiado. En términos técnicos, esto es el evento storage.",image:""},{tittle:"Limitaciones",paragraph:"Esta comunicación entre pestañas utilizando local storage solo funciona dentro del mismo dominio y navegador, ya que diferentes navegadores no comparten el mismo local storage. Además, los datos en local storage no están encriptados, por lo que no es seguro almacenar información sensible.",image:""},{tittle:"Pasos del Proceso",paragraph:"Una pestaña escribe un mensaje en local storage utilizando localStorage.setItem(key, value), Este acto de escribir un mensaje dispara el evento storage en todas las pestañas que están escuchando este evento. Cada pestaña tiene un event listener para el evento storage. Este listener detecta cualquier cambio en el local storage. Cuando el evento storage se dispara, las pestañas pueden leer el nuevo mensaje del local storage y reaccionar en consecuencia, por ejemplo, actualizando su interfaz de usuario.",image:""}],t={tittle:!1,limit:!0,style:{borderTop:"2px solid white",borderBottom:"none"}},n={data:e,bannerImage:a,contentTitle:s,sections:o,researchProps:t};export{a as bannerImage,s as contentTitle,e as data,n as default,t as researchProps,o as sections};
