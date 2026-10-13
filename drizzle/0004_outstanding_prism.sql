CREATE TABLE `job_titles` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`grade` integer NOT NULL,
	`updated` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `job_titles_name_unique` ON `job_titles` (`name`);--> statement-breakpoint
CREATE TABLE `org_aliases` (
	`id` text PRIMARY KEY NOT NULL,
	`old_path` text NOT NULL,
	`new_path` text NOT NULL,
	`created` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `org_audit` (
	`id` text PRIMARY KEY NOT NULL,
	`actor` text NOT NULL,
	`action` text NOT NULL,
	`before` text NOT NULL,
	`after` text NOT NULL,
	`affected` integer NOT NULL,
	`created` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `org_config` (
	`id` text PRIMARY KEY NOT NULL,
	`revision` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `org_nodes` (
	`id` text PRIMARY KEY NOT NULL,
	`path` text NOT NULL,
	`updated` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `org_nodes_path_unique` ON `org_nodes` (`path`);
--> statement-breakpoint
INSERT INTO org_config (id,revision) VALUES ('organization',1);
--> statement-breakpoint
INSERT OR IGNORE INTO org_nodes (id,path,updated) SELECT 'seed-company-'||company,json_array('동원약품그룹',company),MAX(updated) FROM users GROUP BY company;
--> statement-breakpoint
INSERT OR IGNORE INTO org_nodes (id,path,updated) SELECT 'seed-dept-'||json_array(company,dept),json_array('동원약품그룹',company,dept),MAX(updated) FROM users GROUP BY company,dept;
--> statement-breakpoint
INSERT OR IGNORE INTO org_nodes (id,path,updated) SELECT 'seed-branch-'||json_array(company,dept,branch),json_array('동원약품그룹',company,dept,branch),MAX(updated) FROM users WHERE branch<>'' GROUP BY company,dept,branch;
--> statement-breakpoint
INSERT OR IGNORE INTO org_nodes (id,path,updated) VALUES ('seed-company-그룹 직속',json_array('동원약품그룹','그룹 직속'),0);
--> statement-breakpoint
INSERT OR IGNORE INTO org_nodes (id,path,updated) VALUES ('seed-company-동원약품',json_array('동원약품그룹','동원약품'),0);
--> statement-breakpoint
INSERT OR IGNORE INTO org_nodes (id,path,updated) VALUES ('seed-company-동원아이팜',json_array('동원약품그룹','동원아이팜'),0);
--> statement-breakpoint
INSERT OR IGNORE INTO org_nodes (id,path,updated) VALUES ('seed-company-아이팜코리아',json_array('동원약품그룹','아이팜코리아'),0);
--> statement-breakpoint
INSERT OR IGNORE INTO org_nodes (id,path,updated) VALUES ('seed-company-동원헬스케어',json_array('동원약품그룹','동원헬스케어'),0);
--> statement-breakpoint
INSERT OR IGNORE INTO org_nodes (id,path,updated) VALUES ('seed-company-동원약품중부',json_array('동원약품그룹','동원약품중부'),0);
--> statement-breakpoint
INSERT OR IGNORE INTO org_nodes (id,path,updated) VALUES ('seed-company-동원약품남부',json_array('동원약품그룹','동원약품남부'),0);
--> statement-breakpoint
INSERT OR IGNORE INTO org_nodes (id,path,updated) VALUES ('seed-company-동원약품강릉',json_array('동원약품그룹','동원약품강릉'),0);
--> statement-breakpoint
INSERT OR IGNORE INTO org_nodes (id,path,updated) VALUES ('seed-company-동원약품제주',json_array('동원약품그룹','동원약품제주'),0);
--> statement-breakpoint
INSERT OR IGNORE INTO org_nodes (id,path,updated) VALUES ('seed-company-동원약품 원주',json_array('동원약품그룹','동원약품 원주'),0);
--> statement-breakpoint
INSERT OR IGNORE INTO org_nodes (id,path,updated) VALUES ('seed-company-동원약품 중부',json_array('동원약품그룹','동원약품 중부'),0);
--> statement-breakpoint
INSERT OR IGNORE INTO org_nodes (id,path,updated) VALUES ('seed-company-동원약품중부 아산',json_array('동원약품그룹','동원약품중부 아산'),0);
--> statement-breakpoint
INSERT OR IGNORE INTO org_nodes (id,path,updated) VALUES ('seed-company-동원헬스케어 의정부',json_array('동원약품그룹','동원헬스케어 의정부'),0);
--> statement-breakpoint
INSERT OR IGNORE INTO org_nodes (id,path,updated) VALUES ('seed-company-동원헬스케어 제주',json_array('동원약품그룹','동원헬스케어 제주'),0);
--> statement-breakpoint
INSERT OR IGNORE INTO org_nodes (id,path,updated) VALUES ('seed-rootdept-전략기획실',json_array('동원약품그룹','그룹 직속','전략기획실'),0);
--> statement-breakpoint
INSERT OR IGNORE INTO org_nodes (id,path,updated) VALUES ('seed-rootdept-그룹 직속',json_array('동원약품그룹','그룹 직속','그룹 직속'),0);
--> statement-breakpoint
INSERT OR IGNORE INTO job_titles (id,name,grade,updated) VALUES ('seed-job-회장','회장',1,0);
--> statement-breakpoint
INSERT OR IGNORE INTO job_titles (id,name,grade,updated) VALUES ('seed-job-부회장','부회장',2,0);
--> statement-breakpoint
INSERT OR IGNORE INTO job_titles (id,name,grade,updated) VALUES ('seed-job-대표이사','대표이사',3,0);
--> statement-breakpoint
INSERT OR IGNORE INTO job_titles (id,name,grade,updated) VALUES ('seed-job-사장','사장',3,0);
--> statement-breakpoint
INSERT OR IGNORE INTO job_titles (id,name,grade,updated) VALUES ('seed-job-대표','대표',3,0);
--> statement-breakpoint
INSERT OR IGNORE INTO job_titles (id,name,grade,updated) VALUES ('seed-job-부사장','부사장',4,0);
--> statement-breakpoint
INSERT OR IGNORE INTO job_titles (id,name,grade,updated) VALUES ('seed-job-전무','전무',5,0);
--> statement-breakpoint
INSERT OR IGNORE INTO job_titles (id,name,grade,updated) VALUES ('seed-job-지점장','지점장',5,0);
--> statement-breakpoint
INSERT OR IGNORE INTO job_titles (id,name,grade,updated) VALUES ('seed-job-센터장','센터장',5,0);
--> statement-breakpoint
INSERT OR IGNORE INTO job_titles (id,name,grade,updated) VALUES ('seed-job-상무','상무',6,0);
--> statement-breakpoint
INSERT OR IGNORE INTO job_titles (id,name,grade,updated) VALUES ('seed-job-이사','이사',7,0);
--> statement-breakpoint
INSERT OR IGNORE INTO job_titles (id,name,grade,updated) VALUES ('seed-job-관리약사','관리약사',7,0);
--> statement-breakpoint
INSERT OR IGNORE INTO job_titles (id,name,grade,updated) VALUES ('seed-job-이사대우','이사대우',8,0);
--> statement-breakpoint
INSERT OR IGNORE INTO job_titles (id,name,grade,updated) VALUES ('seed-job-부장','부장',9,0);
--> statement-breakpoint
INSERT OR IGNORE INTO job_titles (id,name,grade,updated) VALUES ('seed-job-팀장','팀장',9,0);
--> statement-breakpoint
INSERT OR IGNORE INTO job_titles (id,name,grade,updated) VALUES ('seed-job-실장','실장',9,0);
--> statement-breakpoint
INSERT OR IGNORE INTO job_titles (id,name,grade,updated) VALUES ('seed-job-차장','차장',10,0);
--> statement-breakpoint
INSERT OR IGNORE INTO job_titles (id,name,grade,updated) VALUES ('seed-job-과장','과장',11,0);
--> statement-breakpoint
INSERT OR IGNORE INTO job_titles (id,name,grade,updated) VALUES ('seed-job-대리','대리',12,0);
--> statement-breakpoint
INSERT OR IGNORE INTO job_titles (id,name,grade,updated) VALUES ('seed-job-주임','주임',13,0);
--> statement-breakpoint
INSERT OR IGNORE INTO job_titles (id,name,grade,updated) VALUES ('seed-job-사원','사원',14,0);
--> statement-breakpoint
INSERT OR IGNORE INTO job_titles (id,name,grade,updated) VALUES ('seed-job-소장','소장',14,0);
--> statement-breakpoint
INSERT OR IGNORE INTO job_titles (id,name,grade,updated) VALUES ('seed-job-수석연구원','수석연구원',14,0);
--> statement-breakpoint
INSERT OR IGNORE INTO job_titles (id,name,grade,updated) VALUES ('seed-job-책임연구원','책임연구원',14,0);
--> statement-breakpoint
INSERT OR IGNORE INTO job_titles (id,name,grade,updated) VALUES ('seed-job-CW','CW',14,0);
--> statement-breakpoint
INSERT OR IGNORE INTO job_titles (id,name,grade,updated) VALUES ('seed-job-연구원','연구원',14,0);
--> statement-breakpoint
INSERT OR IGNORE INTO job_titles (id,name,grade,updated) VALUES ('seed-job-선임연구원','선임연구원',14,0);
--> statement-breakpoint
INSERT OR IGNORE INTO job_titles (id,name,grade,updated) SELECT 'seed-job-'||job,job,100,MAX(updated) FROM users WHERE job<>'' GROUP BY job;
