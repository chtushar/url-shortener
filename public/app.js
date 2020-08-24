let form = document.querySelector('form');
let message = document.querySelector('#message');

async function postData(alias, url) {
  await fetch('/url', {
    body: JSON.stringify({
      alias: alias.value,
      url: url.value,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
  })
    .then(async (res) => {
      let data = await res.json();
      return data;
    })
    .then((data) => {
      message.textContent = `Here's your link ${location.origin}/${data.alias}`;
    });
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  let { alias, url } = e.target.elements;

  if (alias.value == '' || url.value == '') {
    message.textContent = 'Cannot be empty';
    return;
  }

  postData(alias, url);
});
