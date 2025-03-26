import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; 
import { FormArray } from '@angular/forms'; 
// import { MatProgressSpinner } from '@angular/material/progress-spinner';
@Component({
  selector: 'app-create-order',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,FormsModule],
  templateUrl: './create-order.component.html',
  styleUrl: './create-order.component.css'
})

export class CreateOrderComponent implements OnInit {

  clients: any[] = [];
  products: any[] = [];
  orderForm!: FormGroup;
  errorMessage:string[] = [];
  successMessage: string = '';
  isLoading: boolean = false; 
  selectedProductId: number =0;
  selectedQuantity: number =0;

  constructor(
    private _orderService: OrderService,
    private fb: FormBuilder
  ) {
    
    this.orderForm = this.fb.group({
      client_id: ['', Validators.required],
      products: this.fb.array([]),
    });
  }

  get productForms(): FormArray {
    return this.orderForm.get('products') as FormArray;
  }
  
  ngOnInit(): void {
    this.getclientsXO();
    this.getproductsXO();
  }

  getclientsXO() {
    this._orderService.getClients().subscribe((data: any) => {
      this.clients = data.clients;
      console.log(data);
    })
  }


  getproductsXO() {
    this._orderService.getProducts().subscribe((data: any) => {
      this.products = data.products;
      console.log(data);
    })
  }


  addProduct(productId: number, quantity: number): void {
    const productGroup = this.fb.group({
      product_id: [productId, Validators.required],
      quantity: [quantity, [Validators.required, Validators.min(1)]],
    });

    this.productForms.push(productGroup);
  }


  onAddProduct(): void {
    if (this.selectedProductId === null || this.selectedQuantity === null) {
      this.errorMessage.push('Por favor, selecciona un producto y una cantidad válida.');      return;
    }

    
    if (this.selectedQuantity <= 0) {
      this.errorMessage.push('La cantidad debe ser mayor que 0.');
      return;
    }

    
    this.addProduct(this.selectedProductId, this.selectedQuantity);

  }



  createOrder(): void {
    if (this.orderForm.invalid) {
      this.errorMessage.push('Por favor, completa todos los campos correctamente.');
      this.isLoading = false;
      return;
    }
   

    if (this.productForms.length === 0) {
      this.errorMessage.push('Debes agregar al menos un producto antes de crear la orden.');
      this.isLoading = false;
      return;
    }
    this.isLoading = true;
    this.successMessage = '';
    
    const orderData = this.orderForm.value;
    this._orderService.createOrder(orderData).subscribe(
      (response) => {
        this.successMessage = 'Orden creada exitosamente.';
        this.errorMessage = [];
        console.log(this.successMessage);
        this.isLoading = false;
        this.getproductsXO();
        while (this.productForms.length !== 0) {
          this.productForms.removeAt(0); // Elimina cada elemento uno por uno
        }
        this.resetSelections()
        this.orderForm.reset(); 
      },
      (error) => {
        this.errorMessage.push(error.error.error); 
        console.log(this.errorMessage);
        this.isLoading = false;
        this.successMessage = '';
      }
    );
  }

  resetSelections(): void {
    this.selectedProductId = 0;
    this.selectedQuantity = 0;
  } 

  removeProduct(index: number): void {
    this.productForms.removeAt(index); 
  }
  //


}
