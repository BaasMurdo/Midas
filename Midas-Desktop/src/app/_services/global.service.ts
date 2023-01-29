import { Injectable } from '@angular/core';
import { ShopSalesFile, CostReportFile, PurchaseReportFile, DepartmentFile, SimpleDropdownOption, DepartmentLines, WarehouseFile, ImportedBuyer, ReorderReportFile } from '@app/classes/_global-classes';
import { Subject } from 'rxjs';

interface DepartmentMap { department: DepartmentLines, itemCode: string }

@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  stores: ShopSalesFile[] = [];
  costs: CostReportFile[] = [];
  purchases: PurchaseReportFile[] = [];
  departments: DepartmentFile[] = [];
  warehouse: WarehouseFile;
  buyers: ImportedBuyer[];
  reorders: ReorderReportFile[] = [];
  markedQty: {itemCode: string, qty: string}[] = [];

  $stepOneUpdate: Subject<boolean> = new Subject<boolean>();
  $stepTwoUpdate: Subject<boolean> = new Subject<boolean>();

  private departmentItemCodeMaps: DepartmentMap[] = [];

  csvPath: string;
  constructor() { }

  // get uniqueBuyers(): string[] {
  //   const result: string[] = [];
  //   if (this.checkIfValidArray(this.departments))
  //     for (let dep of this.departments) {
  //       if (this.checkIfValidArray(dep.lines))
  //         for (let line of dep.lines) {
  //           if (!result.includes(line.buyerName)) {
  //             result.push(line.buyerName);
  //           }
  //         }

  //     }

  //   return result;
  // }

  get uniqueBuyersDropdownOptions(): SimpleDropdownOption[] {
    if (this.checkIfValidArray(this.buyers)) {
      return [...this.buyers.map(b => ({ value: b.name, label: b.name }))]
    } else {
      return [{ value: null, label: 'None' }]
    }
  }

  get uniqueDepartments(): string[] {
    const result: string[] = [];
    if (this.checkIfValidArray(this.departments))
      for (let dep of this.departments) {
        if (this.checkIfValidArray(dep.lines))
          for (let line of dep.lines) {
            if (!result.includes(line.code)) {
              result.push(line.code);
            }
          }

      }

    return result;
  }

  async getReorderQtyByItemCode(itemCode: string, departmentNumber?:string): Promise<any> {
    const reorderStats = {
      shops: [],
      accumulativeQty: 0,
    }
    for(let reorderShop of this.reorders){
      if(departmentNumber){
        for(let line of reorderShop.lines.filter(l => l.departmentNumber === departmentNumber)) {
          if(line.code === itemCode) {
            reorderStats.accumulativeQty += +line.orderQty;
            if(+line.orderQty > 0) {
              reorderStats.shops.push(reorderShop);
            }
          }
        }
      } else {
        for(let line of reorderShop.lines) {
          if(line.code === itemCode) {
            reorderStats.accumulativeQty += +line.orderQty;
            if(+line.orderQty > 0) {
              reorderStats.shops.push(reorderShop);
            }
          }
        }
      }
    }
    // console.log('reoders stats', reorderStats);

    return reorderStats;
  }

  async uniqueDepartmentsDropdownOptions(): Promise<SimpleDropdownOption[]> {
    if (this.checkIfValidArray(this.uniqueDepartments)) {
      return [...this.uniqueDepartments.map(d => ({ value: d, label: d }))]
    }
  }

  async uniqueDepartmentsDropdownOptionsByBuyer(buyerName: string): Promise<SimpleDropdownOption[]> {
    const result: string[] = [];
    if (this.checkIfValidArray(this.departments))
      for (let dep of this.departments) {
        if (this.checkIfValidArray(dep.lines))
          for (let line of dep.lines.filter(d => d.buyer.name === buyerName)) {
            if (!result.includes(line.code)) {
              result.push(line.code);
            }
          }

      }

    return [...result.map(d => ({ value: d, label: d }))]
  }

  checkIfValidArray(arr: any[]): boolean {
    if (arr && arr.length > 0) {
      return true;
    } else {
      return false;
    }

  }

  async assignDepartments(): Promise<any> {
    // const nonDepartmentPurchases = [];
    // const nonDepartmentStoreItems = [];


    for (let store of this.stores) {
      for (let line of store.lines) {
        // @TODO add case for multiple department files.
        const department = this.departments[0].lines.find(dl => dl.code === line.departmentNumber);
        if (department) {
          line.department = department;
          await this.mapDepartments(department, line.code);
        }
        // if(!department){
        //   nonDepartmentStoreItems.push(line.code);
        // }
      }
    }

    for (let purchase of this.purchases) {
      for (let line of purchase.lines) {

        // @TODO add case for multiple department files.
        const department = this.departments[0].lines.find(dl => dl.code === line.departmentNumber);
        if (department) {
          line.department = department;
          await this.mapDepartments(department, line.code);
        }
        // if(!department){
        //   nonDepartmentPurchases.push(line.code);
        // }
      }
    }

    // @Note Lots of puchases and store items without departments.
    // console.log('non departments', {nonDepartmentPurchases, nonDepartmentStoreItems})

    for (let cost of this.costs) {
      for (let line of cost.lines) {
        // @TODO add case for multiple department files.
        const departmentMap = this.departmentItemCodeMaps.find(dl => dl.itemCode === line.code);
        if (departmentMap && departmentMap.department) {
          line.department = departmentMap.department;
          line.departmentNumber = departmentMap.department.code;
        }
      }
    }

    for (let reorder of this.reorders) {
      for (let line of reorder.lines) {
        // @TODO add case for multiple department files.
        const departmentMap = this.departmentItemCodeMaps.find(dl => dl.itemCode === line.code);
        if (departmentMap && departmentMap.department) {
          line.department = departmentMap.department;
          line.departmentNumber = departmentMap.department.code;
        }
      }
    }

    return {};
  }

  async mapDepartments(dep: DepartmentLines, itemCode: string): Promise<any> {

    const map = this.departmentItemCodeMaps.find(m => m.itemCode === itemCode);
    if (!map && dep) {
      this.departmentItemCodeMaps.push({ department: dep, itemCode: itemCode });
    }
    return;
  }
}
