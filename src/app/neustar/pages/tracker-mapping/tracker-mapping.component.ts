import { Component, OnInit } from '@angular/core';
import * as XLSX from 'xlsx';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BlockUIService } from 'ng-block-ui';
import { ApiService } from '../../../api.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import { convertExcelString } from '../../../@core/utils';

@Component({
  selector: 'app-tracker-mapping',
  templateUrl: './tracker-mapping.component.html',
  styleUrls: ['./tracker-mapping.component.scss'],
})
export class TrackerMappingComponent implements OnInit {
  fields: { label: string; key: string; value?: string; required?: boolean; isInput?: boolean }[] = [
    { label: 'Carrier', key: 'carrier', required: true, isInput: true },
    { label: 'Tracker', key: 'tracker', required: true, isInput: true },
    { label: 'Sheet', key: 'sheet', required: true },
    { label: 'Header Row', key: 'header_row', required: true },
    { label: 'Payload Type', key: 'payload_type' },
    { label: 'AP Region', key: 'ap_region' },
    { label: 'PON', key: 'pon', required: true },
    { label: 'ACNA', key: 'acna', value: 'OMQ', isInput: true },
    { label: 'LATA', key: 'lata' },
    { label: 'ICSC', key: 'icsc', value: 'YS00', isInput: true },
    { label: 'Order Initiator', key: 'order_initiator' },
    { label: 'Common ID', key: 'common_id' },
    { label: 'DDD', key: 'ddd' },
    { label: 'Project ID', key: 'project_id' },
    { label: 'Activity', key: 'activity' },
    { label: 'Service Type', key: 'service_type' },
    { label: 'PNUM', key: 'pnum' },
    { label: 'EXP', key: 'exp' },
    { label: 'SPEC', key: 'spec' },
    { label: 'Site ID', key: 'site_id' },
    { label: 'Site Survey Complete', key: 'site_survey_complete' },
    { label: 'Site Requirements', key: 'site_requirements' },
    { label: 'Site Requirements Complete', key: 'site_requirements_complete' },
    { label: 'Site ID_S', key: 'site_id_s' },
    { label: 'Site Survey Complete_S', key: 'site_survey_complete_s' },
    { label: 'Site Requirements_S', key: 'site_requirements_s' },
    { label: 'Site Requirements Complete_S', key: 'site_requirements_complete_s' },
    { label: 'Error Reason', key: 'error_reason' },
    { label: 'ASR No', key: 'asr_no' },
    { label: 'Project Manager', key: 'project_manager' },
    { label: 'FOC Remarks', key: 'foc_remarks' },
    { label: 'Provider Representative', key: 'provider_representative' },
    { label: 'Provider Rep Email', key: 'provider_rep_email' },
    { label: 'ECCKT', key: 'ecckt' },
    { label: 'REF NUM', key: 'ref_num' },
    { label: 'Order Number', key: 'order_number' },
    { label: 'Order Action', key: 'order_action' },
    { label: 'Order Workflow Status', key: 'order_workflow_status' },
    { label: 'Order Jeopardy Reason', key: 'order_jeopardy_reason' },
    { label: 'CLO', key: 'clo' },
    { label: 'VCID', key: 'vcid' },
    { label: 'VC Order Number', key: 'vc_order_number' },
    { label: 'S-VLAN', key: 's_vlan' },
    { label: 'VC Order Workflow Status', key: 'vc_order_workflow_status' },
    { label: 'Order Type', key: 'order_type' },
    { label: 'Circuit Type', key: 'circuit_type' },
    { label: 'Circuit Speed', key: 'circuit_speed' },
    { label: 'Handoff Type', key: 'handoff_type' },
    { label: 'Bandwidth', key: 'bandwidth' },
    { label: 'NNI ID', key: 'nni_id' },
    { label: 'NNI Location', key: 'nni_location' },
    { label: 'Last Mile Provider Name', key: 'last_mile_provider_name' },
    { label: 'Last Mile Provider PON', key: 'last_mile_provider_pon' },
    { label: 'Last Mile FOC Issued Date', key: 'last_mile_foc_issued_date' },
    { label: 'Last Mile Provider Circuit ID', key: 'last_mile_provider_circuit_id' },
    { label: 'Managed ASR', key: 'managed_asr' },
    { label: 'Network Type', key: 'network_type' },
    { label: 'End User', key: 'end_user' },
    { label: 'Address', key: 'address' },
    { label: 'City', key: 'city' },
    { label: 'State', key: 'state' },
    { label: 'Zip Code', key: 'zip_code' },
    { label: 'LCON', key: 'lcon' },
    { label: 'Special Construction', key: 'special_construction' },
    { label: 'Primary Location CLLI', key: 'primary_location_clli' },
    { label: 'Sub-Location 1', key: 'sub_location_1' },
    { label: 'Sub-Location 2', key: 'sub_location_2' },
    { label: 'Sub-Location 3', key: 'sub_location_3' },
    { label: 'Entrance Facility Trial Customer Accepted', key: 'entrance_facility_trial_customer_accepted' },
    { label: 'Fiber Ready', key: 'fiber_ready' },
    { label: 'NTE Placed ECD', key: 'nte_placed_ecd' },
    { label: 'NTE Placed ACD', key: 'nte_placed_acd' },
    { label: 'Permits Required', key: 'permits_required' },
    { label: 'Permits Complete Date', key: 'permits_complete_date' },
    { label: 'Hub Work Required', key: 'hub_work_required' },
    { label: 'End User_S', key: 'end_user_s' },
    { label: 'Address_S', key: 'address_s' },
    { label: 'City_S', key: 'city_s' },
    { label: 'State_S', key: 'state_s' },
    { label: 'Zip Code_S', key: 'zip_code_s' },
    { label: 'LCON_S', key: 'lcon_s' },
    { label: 'Special Construction_S', key: 'special_construction_s' },
    { label: 'Secondary Location CLLI', key: 'secondary_location_clli' },
    { label: 'Sub-Location 1_S', key: 'sub_location_1_s' },
    { label: 'Sub-Location 2_S', key: 'sub_location_2_s' },
    { label: 'Sub-Location 3_S', key: 'sub_location_3_s' },
    { label: 'Entrance Facility Trial Customer Accepted_S', key: 'entrance_facility_trial_customer_accepted_s' },
    { label: 'Fiber Ready_S', key: 'fiber_ready_s' },
    { label: 'NTE Placed ECD_S', key: 'nte_placed_ecd_s' },
    { label: 'NTE Placed ACD_S', key: 'nte_placed_acd_s' },
    { label: 'Permits Required_S', key: 'permits_required_s' },
    { label: 'Permits Complete Date_S', key: 'permits_complete_date_s' },
    { label: 'Hub Work Required_S', key: 'hub_work_required_s' },
    { label: 'Build Complexity', key: 'build_complexity' },
    { label: 'Scope of Work', key: 'scope_of_work' },
    { label: 'Build Notes', key: 'build_notes' },
    { label: 'Engineering Work Order', key: 'engineering_work_order' },
    { label: 'Overall Build Status', key: 'overall_build_status' },
    { label: 'Construction Job ECD', key: 'construction_job_ecd' },
    { label: 'Construction Job ACD', key: 'construction_job_acd' },
    { label: 'Construction Job Status', key: 'construction_job_status' },
    { label: 'Construction Job: ROE Needed', key: 'construction_job_roe_needed' },
    { label: 'Construction Job: ROE Stage', key: 'construction_job_roe_stage' },
    { label: 'Construction Job: ROE Status', key: 'construction_job_roe_status' },
    { label: 'CNR Reason', key: 'cnr_reason' },
    { label: 'Provider Summary Status', key: 'provider_summary_status' },
    { label: 'MRC', key: 'mrc' },
    { label: 'NRC', key: 'nrc' },
    { label: 'Site Visit ECD', key: 'site_visit_ecd' },
    { label: 'Site Visit ACD', key: 'site_visit_acd' },
    { label: 'Customer Premise Ready ECD', key: 'customer_premise_ready_ecd' },
    { label: 'Customer Premise Ready ACD', key: 'customer_premise_ready_acd' },
    { label: 'Infrastructure Complete ECD', key: 'infrastructure_complete_ecd' },
    { label: 'Infrastructure Complete ACD', key: 'infrastructure_complete_acd' },
    { label: 'ASR Complete ECD', key: 'asr_complete_ecd' },
    { label: 'Order Received ACD', key: 'order_received_acd' },
    { label: 'ASR Complete ACD', key: 'asr_complete_acd' },
    { label: 'Application Date ACD', key: 'application_date_acd' },
    { label: 'Design Verification Assignment ACD', key: 'design_verification_assignment_acd' },
    { label: 'DLR Distribution ACD', key: 'dlr_distribution_acd' },
    { label: 'FOC Issued ACD', key: 'foc_issued_acd' },
    { label: 'FOC Issued ECD', key: 'foc_issued_ecd' },
    { label: 'Wired Office Test ACD', key: 'wired_office_test_acd' },
    { label: 'Wired Office Test ECD', key: 'wired_office_test_ecd' },
    { label: 'Fiber Ready Date ACD', key: 'fiber_ready_date_acd' },
    { label: 'Service Term', key: 'service_term' },
    { label: 'Notes', key: 'notes' },
    { label: 'Cancel Date', key: 'cancel_date' },
  ];
  sheetNames: string[];
  worksheets: { [key: string]: XLSX.WorkSheet };
  allHeaders: { label: string; headers: { label: string; value: string }[] }[];
  headers: { label: string; value: string }[];
  trackerForm: FormGroup;
  carrier: string;
  tracker: string;
  succeeded = false;

  get isEdit() {
    return !!this.carrier && !!this.tracker;
  }

  constructor(
    private fb: FormBuilder,
    private blockUIService: BlockUIService,
    private apiService: ApiService,
    private toastrService: ToastrService,
    private route: ActivatedRoute,
  ) {
    this.buildForm();
  }

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      if (params.has('carrier') && params.has('tracker')) {
        this.carrier = params.get('carrier');
        this.tracker = params.get('tracker');
        this.getTrackerMapping();
        if (this.isEdit) {
          this.trackerForm.get('carrier').disable();
          this.trackerForm.get('tracker').disable();
          this.trackerForm.get('sheet').disable();
          this.trackerForm.get('header_row').disable();
        }
      }
    });
  }

  buildForm() {
    this.trackerForm = new FormGroup({});
    this.fields.forEach((field) => {
      this.trackerForm.addControl(
        field.key,
        this.fb.control(field.value || null, field.required ? [Validators.required] : []),
      );
    });
  }

  onFileChange(event: any) {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: 'array' });
        this.sheetNames = workbook.SheetNames;
        this.worksheets = workbook.Sheets;

        event.target.value = '';

        setTimeout(() => {
          this.blockUIService.stop('APP');
        }, 2000);
      };

      this.blockUIService.start('APP', `Parsing...`);
      setTimeout(() => {
        reader.readAsArrayBuffer(file);
      }, 300);
    }
  }

  handleChangeSheet() {
    this.headers = null;
    this.trackerForm.get('header_row').reset();
    this.resetGeneralColumns();
    const worksheet = this.worksheets[this.trackerForm.value.sheet];

    this.allHeaders = [];
    for (let index = 1; index < 10; index++) {
      const headers = [{ label: 'N/A', value: null }];
      for (const key in worksheet) {
        if (key.match(new RegExp('^[A-Z]+' + index + '$'))) {
          const headerStr = convertExcelString(worksheet[key].v);

          if (headerStr) {
            headers.push({ label: headerStr, value: headerStr });
          }
        }
      }

      if (headers.length > 1) {
        this.allHeaders.push({
          label: `Row ${index}: ${headers
            .slice(1, 5)
            .reduce((car, val) => (car = car.concat(val.label)), [])
            .join(', ')}`,
          headers,
        });
      }
    }
  }

  handleChangeHeaders() {
    this.resetGeneralColumns();
    this.headers = this.allHeaders.find((item) => item.label === this.trackerForm.value.header_row)?.headers;
  }

  resetGeneralColumns() {
    this.fields.slice(4).forEach((field) => {
      this.trackerForm.get(field.key).reset();
    });
  }

  getTrackerMapping() {
    this.blockUIService.start('APP', `Loading...`);
    this.apiService.getTrackerMapping(this.carrier, this.tracker).subscribe((res) => {
      if (res.success) {
        this.headers = JSON.parse(res.result.all_headers);
        this.trackerForm.patchValue(res.result);
        this.sheetNames = [res.result.sheet];
        this.allHeaders = [{ label: res.result.header_row, headers: this.headers }];
      }
      this.blockUIService.stop('APP');
    });
  }

  submit() {
    if (this.trackerForm.invalid) {
      this.trackerForm.markAllAsTouched();
      this.toastrService.error('Please fill out all required fields');
      window.scroll({
        top: 0,
        left: 0,
        behavior: 'smooth',
      });
      return;
    }

    this.blockUIService.start('APP', `Saving...`);

    const postData = this.trackerForm.value;

    if (this.isEdit) {
      this.apiService.updateTrackerMapping(this.carrier, this.tracker, postData).subscribe((res) => {
        this.blockUIService.stop('APP');
        if (!res.success) {
          this.toastrService.error(res.message[0]);
          return;
        }
        this.succeeded = true;
      });
    } else {
      this.apiService
        .createTrackerMapping({ ...postData, all_headers: JSON.stringify(this.headers) })
        .subscribe((res) => {
          this.blockUIService.stop('APP');
          if (!res.success) {
            this.toastrService.error(res.message[0]);
            return;
          }
          this.succeeded = true;
        });
    }
  }

  cancel() {
    this.headers = [];
    this.succeeded = false;
    this.trackerForm.reset();
  }
}
