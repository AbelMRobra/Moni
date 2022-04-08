import Swal, { SweetAlertIcon } from 'sweetalert2' 
//Ya que no es un front-end serio, solo completo para que el template sea funcional, esta no es la mejor opcion

var service
var template

(() => {

    type ResponseGet = {
        "id": number,
        "first_name": string,
        "last_name": string,
        "dni": number,
        "gender": string,
        "email": string,
        "amount": number,
        "status":boolean
    };

    const host:string = 'https://moni.xrob.online' //Local
    const api_url:string = `${host}/api/api-applicants/` 
    const login_url:string = `${host}/login/`

    class SweetAlert {
        show_alert:Function = (icon_message:SweetAlertIcon, title:string, text:string):void => {
            swal({
                icon: icon_message,
                title: title,
                text: text,
                showConfirmButton: false,
                // timer: 3000
              });
        }
    };

    class TemplateUtils {
        template_main:HTMLDivElement= (document.getElementById('main-page') as HTMLDivElement);
        template_login:HTMLDivElement = (document.getElementById('login-page') as HTMLDivElement);
        template_admin:HTMLDivElement = (document.getElementById('admin-page') as HTMLDivElement);
        // service_api = new ServiceApi();
       
        change_login:Function = () => {
            console.log("Cambio a login");
            this.template_login.style = ' ';
            this.template_main.style = 'display: none;';
            this.template_admin.style = 'display: none;';
        };

        change_main:Function = () => {
            console.log("Cambio a main");
            this.template_login.style = 'display: none;';
            this.template_main.style = ' ';
            this.template_admin.style = 'display: none;';
        };

        change_admin:Function = () => {
            console.log("Cambio a admin");
            this.template_login.style = 'display: none;';
            this.template_main.style = 'display: none;';
            this.template_admin.style = ' ';
        };

        create_table:Function = (response:ResponseGet[]) => {
            var table = $('#users').DataTable();

            table.clear().draw();

            response.forEach(element => {
                let rowNode = table.row.add( [
                    `<b class="text-info table_row" onClick="service.open_modal(${element.id})" data-toggle="modal" data-target="#client">${element.first_name}</b>`,
                    element.last_name,
                    element.gender,
                    element.dni,
                    element.email,
                    `$${element.amount}`,
                    element.status

                ] ).node().id = `${element.id}`;

            });
 
            table.draw(false)
        };

        delete_row:Function = (id:number) => {
            var row:HTMLTableElement = (document.getElementById(`${id}`) as HTMLTableElement);
            row.remove();
        };

        add_row:Function = (response:ResponseGet) => {

            var table = $('#users').DataTable();
            table.row(`#${response.id}`).data( [
                `<b class="text-info table_row" onClick="service.open_modal(${response.id})" data-toggle="modal" data-target="#client">${response.first_name}</b>`,
                response.last_name,
                response.gender,
                response.dni,
                response.email,
                `$${response.amount}`,
                response.status

            ] ).draw();

        };
    }

    class ServiceApi {
        sweet_alert = new SweetAlert();
        template_utils = new TemplateUtils();
        say_status:Function = () => {console.log("Service is ready")};
        open_modal:Function = (id:number) => {
            console.log("Open modal");

            this.get_user_data(id);

            var boton:HTMLButtonElement = (document.getElementById('boton_delete') as HTMLButtonElement);
            boton.onclick = () => {
                this.delete_data(id);
            };


        };
        login:Function = async () => {

            var message_proccesing = this.sweet_alert.show_alert('info', 'Ingresando a la aplicación', 'Espere unos segundos por favor');
            var request = await fetch(login_url ,{
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    'username': `${ (document.getElementById('username') as HTMLInputElement).value}`,
                    'password': `${(document.getElementById('password') as HTMLInputElement).value}`
                })
            }).catch((error) => {
                console.log(error);
                this.sweet_alert.show_alert('error', 'Problemas de la app', 'Problemas al enviar');
            })

            var response = await request.json();
            var status_code = await request.status;
            
            var template_managment = ():void => {
                if (status_code >= 200 && status_code < 300) {
                    localStorage.setItem("token", response);
                    this.template_utils.change_admin();
                    this.sweet_alert.show_alert('success', 'Binvenido!', 'Ingresaste con exito al panel de usuarios');
                    this.get_data();
                } else {
                    this.sweet_alert.show_alert('error', 'Problemas de servidor', 'Tenemos un problema')
                }
            };
            template_managment();

        }
        
        send_client_data:Function = async () => {

            var message_proccesing = this.sweet_alert.show_alert('info', 'Procesando tu pedido', 'Espere unos segundos por favor');
            var request = await fetch(api_url ,{
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    'first_name': `${ (document.getElementById('first_name') as HTMLInputElement).value}`,
                    'last_name': `${(document.getElementById('last_name') as HTMLInputElement).value}`,
                    'dni': `${(document.getElementById('dni') as HTMLInputElement).value}`.replace(".", "").replace(",", ""),
                    'email': `${(document.getElementById('email') as HTMLInputElement).value}`,
                    'gender': `${(document.getElementById('gender') as HTMLInputElement).value}`,
                    'amount': `${(document.getElementById('amount') as HTMLInputElement).value}`

                })
            }).catch((error) => {
                console.log(error);
                this.sweet_alert.show_alert('error', 'Problemas de la app', 'Problemas al enviar');
            })

            var response = await request.json();
            var status_code = await request.status;
            console.log(response)

            var template_managment = ():void => {
                if (status_code >= 200 && status_code < 300) {
                    this.sweet_alert.show_alert(response.icon, response.title, response.message)
                } else {
                    this.sweet_alert.show_alert('error', 'Ups!', (response.message) ? response.message: 'Hay un problema con su solicitud, por favor revise bien los datos')
                }
            };
            template_managment();
        };
        
        get_data:Function = async () => {

            var token = localStorage.getItem("token");
            var request = await fetch(api_url ,{
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`,
                },

            }).catch((error) => {
                console.log(error);
                this.sweet_alert.show_alert('error', 'Problemas de la app', 'Problemas al enviar');
            })

            var response = await request.json();
            var status_code = await request.status;
            
            var template_managment = ():void => {
                if (status_code >= 200 && status_code < 300) {
                    console.log(response);
                    this.template_utils.create_table(response);
                } else {
                    this.sweet_alert.show_alert('error', 'Problemas de servidor', 'Tenemos un problema')
                }
            };
            template_managment();
        };

        get_user_data:Function = async (id:number) => {
            
            var token = localStorage.getItem("token");
            var request = await fetch(`${api_url}${id}` ,{
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`,
                },

            }).catch((error) => {
                console.log(error);
                this.sweet_alert.show_alert('error', 'Problemas de la app', 'Problemas al enviar');
            })

            var response = await request.json();
            var status_code = await request.status;
            
            var template_managment = ():void => {
                if (status_code >= 200 && status_code < 300) {
                    console.log("Consulta exitosa");
                    console.log(response);

                    var up_id:HTMLFormElement = (document.getElementById('up_id') as HTMLFormElement);
                    up_id.value = response.id;
                    
                    var up_first_name:HTMLFormElement = (document.getElementById('up_first_name') as HTMLFormElement);
                    up_first_name.value = response.first_name;

                    var up_last_name:HTMLFormElement = (document.getElementById('up_last_name') as HTMLFormElement);
                    up_last_name.value = response.last_name;

                    var up_email:HTMLFormElement = (document.getElementById('up_email') as HTMLFormElement);
                    up_email.value = response.email;

                    var up_gender:HTMLFormElement = (document.getElementById('up_gender') as HTMLFormElement);
                    up_gender.value = response.gender;

                    var up_amount:HTMLFormElement = (document.getElementById('up_amount') as HTMLFormElement);
                    up_amount.value = response.amount;
                
                } else {
                    console.log("Consulta fallida");
                    console.log(response);
                    this.sweet_alert.show_alert('error', 'Problemas de servidor', 'Pruebe mas tarde')
                }
            };
            template_managment();
        };

        delete_data:Function = async (id:number) => {

            var token = localStorage.getItem("token");
            var request = await fetch(`${api_url}${id}/` ,{
                method: "DELETE",
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json',
                },

            }).catch((error) => {
                console.log(error);
                this.sweet_alert.show_alert('error', 'Problemas de la app', 'Problemas al enviar');
            })

            var status_code = await request.status;
            
            var template_managment = ():void => {
                if (status_code >= 200 && status_code < 300) {
                    this.template_utils.delete_row(id);
                    this.sweet_alert.show_alert('success', 'Eliminado!', 'Se elimino el registro');
                } else {
                    this.sweet_alert.show_alert('error', 'Problemas de servidor', 'Tenemos un problema')
                }
            };
            template_managment();
        };

        upload_data:Function = async () => {

            var token = localStorage.getItem("token");
            var id_user:number = Number((document.getElementById('up_id') as HTMLInputElement).value);
            var request = await fetch(`${api_url}${id_user}/` ,{
                method: "PATCH",
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json',
                },
                
                body: JSON.stringify({
                    'first_name': `${ (document.getElementById('up_first_name') as HTMLInputElement).value}`,
                    'last_name': `${(document.getElementById('up_last_name') as HTMLInputElement).value}`,
                    'email': `${(document.getElementById('up_email') as HTMLInputElement).value}`,
                    'gender': `${(document.getElementById('up_gender') as HTMLInputElement).value}`,
                    'amount': `${(document.getElementById('up_amount') as HTMLInputElement).value}`

                })

            }).catch((error) => {
                console.log(error);
                this.sweet_alert.show_alert('error', 'Problemas de la app', 'Problemas al enviar');
            })

            var response = await request.json();
            var status_code = await request.status;
            
            var template_managment = ():void => {
                if (status_code >= 200 && status_code < 300) {
                    this.sweet_alert.show_alert('success', 'Editado!', 'Se edito el registro sin problemas');
                    this.template_utils.add_row(response);
  
                } else {
                    this.sweet_alert.show_alert('error', 'Problemas de servidor', 'Tenemos un problema');
                }
            };
            
            template_managment();
        };

    };

    service = new ServiceApi();
    service.say_status();
    template = new TemplateUtils();
    

})()