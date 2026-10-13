export type ApprovalPerson={id:string;name:string;job:string;company:string;dept:string;stage?:string};
export type ApprovalDocument={id:string;author_id:string;author_name:string;title:string;kind:string;body:string;amount:number;start_date:string;end_date:string;line:ApprovalPerson[];references:ApprovalPerson[];leave_data:string;status:string;step:number;version:number;created:number;updated:number};
export type ApprovalEvent={id:string;document_id:string;actor_id:string;actor_name:string;action:string;comment:string;created:number};
export const approvalStatuses:Record<string,string>={draft:'임시저장',pending:'결재 진행',approved:'승인 완료',rejected:'반려',withdrawn:'회수'};
export const approvalActions:Record<string,string>={save:'임시저장',submit:'상신',approve:'승인',reject:'반려',withdraw:'회수'};
export const approvalKinds=['업무 기안','지출 결의','구매 요청','휴가 신청'];
