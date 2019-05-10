import ModalPopup from './AdminPanel/component/sidebarComponents/modalPopup';

export default {
  isAuthenticated: false,
  isLoaded: false,
  comboValue() {
    var cbo = document.getElementById('select-profession');
    console.log('cbo ' + cbo);
    if (cbo !== null) {
      alert('The selected text is ' + cbo.options[cbo.selectedIndex].value);
    }
  },
  onEditBtnClick() {
    var btn = document.getElementById('btn');
    var modal = document.getElementById('exampleModal');
    btn.onclick = function(event) {
      // "exampleModal".modal("show");

      // var Modal = ReactBootstrap.Modal;

      // btn.toggle-data
      console.log();
    };
    // modal.style.display = "block";
    // modal.style.boxShadow = "";
  },
  authenticate(cb) {
    fetch('http://localhost:5000/checkauthenticated', {
      method: 'GET',
      credentials: 'include',
    })
      .then(function(res) {
        return res.json();
      })
      .then(response => {
        console.log(response);
        if (response.authenticate === 'true') {
          this.isAuthenticated = true;
          this.isLoaded = true;
        } else if (response.authenticate === 'false') {
          this.isLoaded = true;
          this.isAuthenticated = false;
        } else {
          console.log('Serious Error');
          this.isLoaded = true;
          this.isAuthenticated = false;
        }
        console.log('hello world');
        cb(this.isAuthenticated, this.isLoaded);
      })
      .catch(function(res) {
        console.log(res);
      });
  },
  signout() {
    fetch('http://localhost:5000/logout', {
      method: 'GET',
      credentials: 'include',
    })
      .then(function(res) {
        return res.json();
      })
      .then(response => {
        console.log(response);
        if (response.statusCode === 200) {
          this.isAuthenticated = false;
        } else {
          console.log('Serious Error');
        }
        // cb(this.isAuthenticated, this.isLoaded);
      })
      .catch(function(res) {
        console.log(res);
      });
  },
};
