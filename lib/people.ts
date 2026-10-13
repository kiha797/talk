export const companies = ['그룹 직속','동원약품','동원아이팜','아이팜코리아','동원헬스케어','동원약품중부','동원약품남부','동원약품강릉','동원약품제주','동원약품 원주','동원약품 중부','동원약품중부 아산','동원헬스케어 의정부','동원헬스케어 제주'];
export const departments = ['구매영업팀','고객상담팀','경리총무팀','종합병원팀','병의원팀','약국영업부','제품관리팀','배송관리팀'];
export type Person = {id:string;username:string;name:string;profileImageUrl?:string;company:string;branch:string;dept:string;role:string;color:string;accessRole:string;hrManager?:boolean;csScope:string[];status:string;mustChange:boolean;created:number;updated?:number;notice_kind?:string;notice_entity?:string;notice_actor?:string};
export type Room={id:string;title:string;members:string[];kind:string;updated:number;unread?:number;last?:string};
export type Message={id:string;room:string;sender:string;body:string;created:number;updated?:number;notice_kind?:string;notice_entity?:string;notice_actor?:string};

export const organizationLeaders = [{"name": "현준호", "role": "대표"}, {"name": "현준재", "role": "대표"}];
