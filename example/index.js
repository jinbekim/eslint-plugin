const lists = document.getElementsByClassName('example');
const lists2 = document.getElementsByTagNameNS('example');
const lists3 = document.getElementsByName('example');
const list4 = document.getElementsByTagName('example');

document.getElementsByClassName('example')?.forEach(console.log); // error

{
  lists2.forEach(console.log); // error
  {
    lists?.forEach(console.log); // error
  }
  lists3.forEach(console.log); // not error
}

lists.forEach(console.log); // error
