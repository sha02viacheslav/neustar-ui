import { NeustarFalloutRetry } from '@models';

export interface NeustarTemplateUpload {
  rowid: number;
  carrierid: string;
  tracker_file_path: string;
  template_upload_status: string;
  total_count: string;
  success_count: string;
  error_count: string;
  validation_count: string;
  validation_result: string;
  processed_template_path: string;
  bot_execution_status: string;
  exception: string;
  exception_logs: string;
  start_time: string;
  end_time: string;
  execution_time: string;
  invalid_pon_count: string;
  falloutRetrys: NeustarFalloutRetry[];
}
