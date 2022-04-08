"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
//Ya que no es un front-end serio, solo completo para que el template sea funcional, esta no es la mejor opcion
var service;
var template;
(() => {
    const host = 'https://moni.xrob.online'; //Local
    const api_url = `${host}/api/api-applicants/`;
    const login_url = `${host}/login/`;
    class SweetAlert {
        constructor() {
            this.show_alert = (icon_message, title, text) => {
                swal({
                    icon: icon_message,
                    title: title,
                    text: text,
                    showConfirmButton: false,
                    // timer: 3000
                });
            };
        }
    }
    ;
    class TemplateUtils {
        constructor() {
            this.template_main = document.getElementById('main-page');
            this.template_login = document.getElementById('login-page');
            this.template_admin = document.getElementById('admin-page');
            // service_api = new ServiceApi();
            this.change_login = () => {
                console.log("Cambio a login");
                this.template_login.style = ' ';
                this.template_main.style = 'display: none;';
                this.template_admin.style = 'display: none;';
            };
            this.change_main = () => {
                console.log("Cambio a main");
                this.template_login.style = 'display: none;';
                this.template_main.style = ' ';
                this.template_admin.style = 'display: none;';
            };
            this.change_admin = () => {
                console.log("Cambio a admin");
                this.template_login.style = 'display: none;';
                this.template_main.style = 'display: none;';
                this.template_admin.style = ' ';
            };
            this.create_table = (response) => {
                var table = $('#users').DataTable();
                table.clear().draw();
                response.forEach(element => {
                    let rowNode = table.row.add([
                        `<b class="text-info table_row" onClick="service.open_modal(${element.id})" data-toggle="modal" data-target="#client">${element.first_name}</b>`,
                        element.last_name,
                        element.gender,
                        element.dni,
                        element.email,
                        `$${element.amount}`,
                        element.status
                    ]).node().id = `${element.id}`;
                });
                table.draw(false);
            };
            this.delete_row = (id) => {
                var row = document.getElementById(`${id}`);
                row.remove();
            };
            this.add_row = (response) => {
                var table = $('#users').DataTable();
                table.row(`#${response.id}`).data([
                    `<b class="text-info table_row" onClick="service.open_modal(${response.id})" data-toggle="modal" data-target="#client">${response.first_name}</b>`,
                    response.last_name,
                    response.gender,
                    response.dni,
                    response.email,
                    `$${response.amount}`,
                    response.status
                ]).draw();
            };
        }
    }
    class ServiceApi {
        constructor() {
            this.sweet_alert = new SweetAlert();
            this.template_utils = new TemplateUtils();
            this.say_status = () => { console.log("Service is ready"); };
            this.open_modal = (id) => {
                console.log("Open modal");
                this.get_user_data(id);
                var boton = document.getElementById('boton_delete');
                boton.onclick = () => {
                    this.delete_data(id);
                };
            };
            this.login = () => __awaiter(this, void 0, void 0, function* () {
                var message_proccesing = this.sweet_alert.show_alert('info', 'Ingresando a la aplicación', 'Espere unos segundos por favor');
                var request = yield fetch(login_url, {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        'username': `${document.getElementById('username').value}`,
                        'password': `${document.getElementById('password').value}`
                    })
                }).catch((error) => {
                    console.log(error);
                    this.sweet_alert.show_alert('error', 'Problemas de la app', 'Problemas al enviar');
                });
                var response = yield request.json();
                var status_code = yield request.status;
                var template_managment = () => {
                    if (status_code >= 200 && status_code < 300) {
                        localStorage.setItem("token", response);
                        this.template_utils.change_admin();
                        this.sweet_alert.show_alert('success', 'Binvenido!', 'Ingresaste con exito al panel de usuarios');
                        this.get_data();
                    }
                    else {
                        this.sweet_alert.show_alert('error', 'Problemas de servidor', 'Tenemos un problema');
                    }
                };
                template_managment();
            });
            this.send_client_data = () => __awaiter(this, void 0, void 0, function* () {
                var message_proccesing = this.sweet_alert.show_alert('info', 'Procesando tu pedido', 'Espere unos segundos por favor');
                var request = yield fetch(api_url, {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        'first_name': `${document.getElementById('first_name').value}`,
                        'last_name': `${document.getElementById('last_name').value}`,
                        'dni': `${document.getElementById('dni').value}`.replace(".", "").replace(",", ""),
                        'email': `${document.getElementById('email').value}`,
                        'gender': `${document.getElementById('gender').value}`,
                        'amount': `${document.getElementById('amount').value}`
                    })
                }).catch((error) => {
                    console.log(error);
                    this.sweet_alert.show_alert('error', 'Problemas de la app', 'Problemas al enviar');
                });
                var response = yield request.json();
                var status_code = yield request.status;
                console.log(response);
                var template_managment = () => {
                    if (status_code >= 200 && status_code < 300) {
                        this.sweet_alert.show_alert(response.icon, response.title, response.message);
                    }
                    else {
                        this.sweet_alert.show_alert('error', 'Ups!', (response.message) ? response.message : 'Hay un problema con su solicitud, por favor revise bien los datos');
                    }
                };
                template_managment();
            });
            this.get_data = () => __awaiter(this, void 0, void 0, function* () {
                var token = localStorage.getItem("token");
                var request = yield fetch(api_url, {
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Token ${token}`,
                    },
                }).catch((error) => {
                    console.log(error);
                    this.sweet_alert.show_alert('error', 'Problemas de la app', 'Problemas al enviar');
                });
                var response = yield request.json();
                var status_code = yield request.status;
                var template_managment = () => {
                    if (status_code >= 200 && status_code < 300) {
                        console.log(response);
                        this.template_utils.create_table(response);
                    }
                    else {
                        this.sweet_alert.show_alert('error', 'Problemas de servidor', 'Tenemos un problema');
                    }
                };
                template_managment();
            });
            this.get_user_data = (id) => __awaiter(this, void 0, void 0, function* () {
                var token = localStorage.getItem("token");
                var request = yield fetch(`${api_url}${id}`, {
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Token ${token}`,
                    },
                }).catch((error) => {
                    console.log(error);
                    this.sweet_alert.show_alert('error', 'Problemas de la app', 'Problemas al enviar');
                });
                var response = yield request.json();
                var status_code = yield request.status;
                var template_managment = () => {
                    if (status_code >= 200 && status_code < 300) {
                        console.log("Consulta exitosa");
                        console.log(response);
                        var up_id = document.getElementById('up_id');
                        up_id.value = response.id;
                        var up_first_name = document.getElementById('up_first_name');
                        up_first_name.value = response.first_name;
                        var up_last_name = document.getElementById('up_last_name');
                        up_last_name.value = response.last_name;
                        var up_email = document.getElementById('up_email');
                        up_email.value = response.email;
                        var up_gender = document.getElementById('up_gender');
                        up_gender.value = response.gender;
                        var up_amount = document.getElementById('up_amount');
                        up_amount.value = response.amount;
                    }
                    else {
                        console.log("Consulta fallida");
                        console.log(response);
                        this.sweet_alert.show_alert('error', 'Problemas de servidor', 'Pruebe mas tarde');
                    }
                };
                template_managment();
            });
            this.delete_data = (id) => __awaiter(this, void 0, void 0, function* () {
                var token = localStorage.getItem("token");
                var request = yield fetch(`${api_url}${id}/`, {
                    method: "DELETE",
                    headers: {
                        'Authorization': `Token ${token}`,
                        'Content-Type': 'application/json',
                    },
                }).catch((error) => {
                    console.log(error);
                    this.sweet_alert.show_alert('error', 'Problemas de la app', 'Problemas al enviar');
                });
                var status_code = yield request.status;
                var template_managment = () => {
                    if (status_code >= 200 && status_code < 300) {
                        this.template_utils.delete_row(id);
                        this.sweet_alert.show_alert('success', 'Eliminado!', 'Se elimino el registro');
                    }
                    else {
                        this.sweet_alert.show_alert('error', 'Problemas de servidor', 'Tenemos un problema');
                    }
                };
                template_managment();
            });
            this.upload_data = () => __awaiter(this, void 0, void 0, function* () {
                var token = localStorage.getItem("token");
                var id_user = Number(document.getElementById('up_id').value);
                var request = yield fetch(`${api_url}${id_user}/`, {
                    method: "PATCH",
                    headers: {
                        'Authorization': `Token ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        'first_name': `${document.getElementById('up_first_name').value}`,
                        'last_name': `${document.getElementById('up_last_name').value}`,
                        'email': `${document.getElementById('up_email').value}`,
                        'gender': `${document.getElementById('up_gender').value}`,
                        'amount': `${document.getElementById('up_amount').value}`
                    })
                }).catch((error) => {
                    console.log(error);
                    this.sweet_alert.show_alert('error', 'Problemas de la app', 'Problemas al enviar');
                });
                var response = yield request.json();
                var status_code = yield request.status;
                var template_managment = () => {
                    if (status_code >= 200 && status_code < 300) {
                        this.sweet_alert.show_alert('success', 'Editado!', 'Se edito el registro sin problemas');
                        this.template_utils.add_row(response);
                    }
                    else {
                        this.sweet_alert.show_alert('error', 'Problemas de servidor', 'Tenemos un problema');
                    }
                };
                template_managment();
            });
        }
    }
    ;
    service = new ServiceApi();
    service.say_status();
    template = new TemplateUtils();
})();
