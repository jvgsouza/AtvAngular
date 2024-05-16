import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { EnderecoService } from './services/endereco.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Endereco } from './models/endereço';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  userForm: FormGroup = this.fb.group({});

  constructor(
    private fb: FormBuilder,
    private enderecoService: EnderecoService,
  ) {}

  ngOnInit(): void {
    this.userForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.pattern(/^\S+\s\S+/)]],
      dob: ['', Validators.required],
      cpf: ['', [Validators.required, Validators.minLength(11), Validators.maxLength(11)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(11)]],
      cep: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(8)]],
      street: ['', Validators.required],
      number: ['', Validators.required],
      complement: [''],
      neighborhood: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required]
    });
  }

  fetchAddressData(){
    const cepControl = this.userForm.get('cep');
    if(cepControl?.valid) {
      this.enderecoService.getEndereco(cepControl.value).then((endereco: Endereco) => {
        this.userForm.get("street")?.setValue(endereco.logradouro);
        this.userForm.get("neighborhood")?.setValue(endereco.bairro);
        this.userForm.get("city")?.setValue(endereco.cidade);
        this.userForm.get("state")?.setValue(endereco.uf);
      }).catch(() => {
        alert("Erro ao buscar dados do CEP");
      })
    }
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      this.userForm.reset();
      alert("Formulário enviado com sucesso!");
    } else {
      alert("Formulário inválido");
    }
  }
}
