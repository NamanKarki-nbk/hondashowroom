--
-- PostgreSQL database dump
--

\restrict 42phgNF2OVkKU1SP9wexa9eJsyU2X1z6HQfsR7oOO9MHC1J8gLqeEmTibESA6um

-- Dumped from database version 18.6 (c5250a2)
-- Dumped by pg_dump version 18.6

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: user; Type: TABLE DATA; Schema: neon_auth; Owner: neon_auth
--



--
-- Data for Name: account; Type: TABLE DATA; Schema: neon_auth; Owner: neon_auth
--



--
-- Data for Name: organization; Type: TABLE DATA; Schema: neon_auth; Owner: neon_auth
--



--
-- Data for Name: invitation; Type: TABLE DATA; Schema: neon_auth; Owner: neon_auth
--



--
-- Data for Name: jwks; Type: TABLE DATA; Schema: neon_auth; Owner: neon_auth
--



--
-- Data for Name: member; Type: TABLE DATA; Schema: neon_auth; Owner: neon_auth
--



--
-- Data for Name: project_config; Type: TABLE DATA; Schema: neon_auth; Owner: neon_auth
--

INSERT INTO neon_auth.project_config VALUES ('1ed59bec-a434-489c-a41f-4e073f944809', 'honda-showroom', 'ep-divine-king-aznw5hiw', '2026-08-21 06:08:47.588+00', '2026-08-21 06:08:47.588+00', '[]', '[{"id": "google", "isShared": true}]', '{"type": "shared"}', '{"enabled": true, "disableSignUp": false, "emailVerificationMethod": "otp", "requireEmailVerification": false, "autoSignInAfterVerification": true, "sendVerificationEmailOnSignIn": false, "sendVerificationEmailOnSignUp": false}', true, '{"magicLink": {"config": {"expiresIn": 5, "disableSignUp": false}, "enabled": false}, "phoneNumber": {"config": {"otp_expires_in": 300}, "enabled": false}, "organization": {"config": {"creatorRole": "owner", "membershipLimit": 100, "organizationLimit": 10, "sendInvitationEmail": false}, "enabled": true}}', '{"enabled": false, "enabledEvents": [], "timeoutSeconds": 5}');


--
-- Data for Name: session; Type: TABLE DATA; Schema: neon_auth; Owner: neon_auth
--



--
-- Data for Name: verification; Type: TABLE DATA; Schema: neon_auth; Owner: neon_auth
--



--
-- Data for Name: Accessory; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

INSERT INTO public."Accessory" VALUES ('d0515814-6981-40cd-b92c-f2172f1ff08d', 'URBAN BLACK STRIP XL (Blue)', 'Helmet', 2100, '/accessories/1787752871997-898u68.png', 'IN_STOCK', 'N6 OPEN FACE URBAN BLACK STRIP XL', '2026-08-22 06:23:22.655', '2026-08-26 14:01:12.004', '{"All Models"}', '8902613554999-H', 'Universal');
INSERT INTO public."Accessory" VALUES ('b4f6b8dd-eac1-473d-8942-b5db51ef43ac', 'URBAN BLACK STRIP XL (Matte Black)', 'Helmet', 2200, '/accessories/1787752881276-64grrj.png', 'IN_STOCK', 'N6 OPEN FACE URBAN BLACK STRIP XL', '2026-08-22 05:42:54.737', '2026-08-26 14:01:21.277', '{"All Models"}', '8902613554999-H', 'Universal');


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

INSERT INTO public."User" VALUES ('364481a1-4af6-4357-af87-304ddd5b7b9b', 'System Admin', '0000000000', 'admin@honda.com', '$2b$10$mEc3nVpBIsDgT.9jBTuFeOeqoMXoPVKluhb0Pz/fSSdaRPJNlY/de', NULL, '2026-08-14 13:04:03.571', '2026-08-27 06:05:05.974', 'SUPERADMIN', NULL, NULL, NULL, NULL, false);
INSERT INTO public."User" VALUES ('7bee1d2b-bef9-45b8-96ae-7007dbe2b573', 'Success Bhattarai', '9863034005', 'successbhattarai1998@gmail.com', NULL, 'https://lh3.googleusercontent.com/a/ACg8ocLcYeN54Ha-1hS7688OXzsg7M_-YcOxDQC2HJFJjnPzvER7MhvF=s96-c', '2026-08-14 13:58:39.785', '2026-08-30 04:48:43.206', 'ADMIN', 'Damak-05, Jhapa', '1998 FEB 18', '२०५४/११/०६', 'MALE', false);
INSERT INTO public."User" VALUES ('2fed4569-ad05-422a-a027-47f49e5f765a', 'Society Karki', 'google-1788080715006', 'societykarki07@gmail.com', '$2b$10$G56rqyIngV7iXMRSCW0JQ.GzXFS1LUFSYabrCj8k1v3.wSPA8bDjC', 'https://lh3.googleusercontent.com/a/ACg8ocJ7AYl3yOdeP4JKyne_EHwdz7PJfHnGj1HwWANnoVUO1DWkrnlt=s96-c', '2026-08-30 09:05:17.139', '2026-08-30 09:32:55.854', 'USER', NULL, NULL, NULL, NULL, true);


--
-- Data for Name: ActivityLog; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

INSERT INTO public."ActivityLog" VALUES ('685286a9-0879-466e-beeb-3cc13d69d92c', '364481a1-4af6-4357-af87-304ddd5b7b9b', 'LOGIN', 'System', NULL, '{"message": "First login as SUPERADMIN"}', '2026-08-27 06:05:06.081');
INSERT INTO public."ActivityLog" VALUES ('1a51ea91-30aa-4eaf-8a9d-bcff80ebef97', '7bee1d2b-bef9-45b8-96ae-7007dbe2b573', 'UPDATE', 'Lead', '8cf55637-64d3-43f2-b786-c82c5db24df1', '{"id": "8cf55637-64d3-43f2-b786-c82c5db24df1", "name": "Success Bhattarai", "phone": "+9779863034005", "status": "NEW"}', '2026-08-30 04:49:23.532');
INSERT INTO public."ActivityLog" VALUES ('0fee478a-b49b-4e83-8092-8ee7ee1e3992', '7bee1d2b-bef9-45b8-96ae-7007dbe2b573', 'UPDATE', 'Lead', '8cf55637-64d3-43f2-b786-c82c5db24df1', '{"id": "8cf55637-64d3-43f2-b786-c82c5db24df1", "name": "Success Bhattarai", "phone": "+9779863034005", "status": "NEW"}', '2026-08-30 04:49:25.067');
INSERT INTO public."ActivityLog" VALUES ('7de5abad-c5dc-4777-ab3b-e4810d3633fb', '364481a1-4af6-4357-af87-304ddd5b7b9b', 'UPDATE', 'VehicleInventory', '642b8cbf-c353-4f1d-9760-aa9741baba96', '{"notes": null, "vehicleId": "642b8cbf-c353-4f1d-9760-aa9741baba96", "fromBranchId": null, "targetBranchId": "59143622-ba27-43ef-b20b-e3e7ee99f700"}', '2026-08-30 08:03:00.758');
INSERT INTO public."ActivityLog" VALUES ('aa25d0ca-5f53-4dc7-9c75-5dc5a7aaeb77', '364481a1-4af6-4357-af87-304ddd5b7b9b', 'UPDATE', 'VehicleInventory', '7dc5d1dc-ed72-48b5-811d-e7a379d38804', '{"notes": null, "vehicleId": "7dc5d1dc-ed72-48b5-811d-e7a379d38804", "fromBranchId": null, "targetBranchId": "59143622-ba27-43ef-b20b-e3e7ee99f700"}', '2026-08-30 08:03:23.204');
INSERT INTO public."ActivityLog" VALUES ('1d444312-cb74-4545-a67b-4a0d7ffc6151', '364481a1-4af6-4357-af87-304ddd5b7b9b', 'CREATE', 'VehicleInventory', 'b8853b80-a318-40f8-a4de-829f65a247c9', '{"invoiceNo": "BNSRBSPI83/84-00104", "totalAmount": 3376389.39, "purchaseType": "BG"}', '2026-08-30 08:21:39.339');
INSERT INTO public."ActivityLog" VALUES ('c5fba50e-9555-4f96-a76f-47c4aef28f61', '364481a1-4af6-4357-af87-304ddd5b7b9b', 'CREATE', 'VehicleInventory', '4a902c30-4b6c-4262-9f72-3bb7f63f245e', '{"vin": "ME4JK380GTN005330", "color": "B221X (Candy Jazzy Blue", "indexNo": "D1-P1", "modelName": "CB Dio BS6 110 STD"}', '2026-08-30 08:21:39.656');
INSERT INTO public."ActivityLog" VALUES ('ec63cd5a-c85f-4f8c-805e-76ff23b21de7', '364481a1-4af6-4357-af87-304ddd5b7b9b', 'CREATE', 'VehicleInventory', 'd534cd01-46d6-469a-be7d-a0d7ac770919', '{"vin": "ME4JK380GTN005352", "color": "B221X (Candy Jazzy Blue", "indexNo": "D1-P2", "modelName": "CB Dio BS6 110 STD"}', '2026-08-30 08:21:39.866');
INSERT INTO public."ActivityLog" VALUES ('22790700-3a1b-430c-88b2-2feaab2bc15a', '364481a1-4af6-4357-af87-304ddd5b7b9b', 'CREATE', 'VehicleInventory', '019ba8a3-add9-4cf2-9a41-ccf31869e891', '{"vin": "ME4JK380GTN005400", "color": "R393D (Sports Red)", "indexNo": "D1-P3", "modelName": "CB Dio BS6 110 STD"}', '2026-08-30 08:21:40.072');
INSERT INTO public."ActivityLog" VALUES ('995cb9d0-eb5c-4e3d-bc21-265a50ae2a1f', '364481a1-4af6-4357-af87-304ddd5b7b9b', 'CREATE', 'VehicleInventory', '459a4d0d-1599-4717-a042-9419be8e6a02', '{"vin": "ME4JK380GTN005426", "color": "R393D (Sports Red)", "indexNo": "D1-P4", "modelName": "CB Dio BS6 110 STD"}', '2026-08-30 08:21:40.279');
INSERT INTO public."ActivityLog" VALUES ('ee02af8f-85fa-41d5-b350-62443688c874', '364481a1-4af6-4357-af87-304ddd5b7b9b', 'CREATE', 'VehicleInventory', 'ba21e44a-6a1b-4290-9e54-2f7cd300a98d', '{"vin": "ME4JK384LSN012788", "color": "R395 (Matt Red Metallic)", "indexNo": "D1-P5", "modelName": "CB Dio BS6 110 DLX"}', '2026-08-30 08:21:40.488');
INSERT INTO public."ActivityLog" VALUES ('c3f5649f-07d3-4b82-a3ba-7363dc4e79f1', '364481a1-4af6-4357-af87-304ddd5b7b9b', 'CREATE', 'VehicleInventory', 'a64bef46-431f-4234-9757-1c90562ea04f', '{"vin": "ME4JK384LSN012790", "color": "R395 (Matt Red Metallic)", "indexNo": "D1-P6", "modelName": "CB Dio BS6 110 DLX"}', '2026-08-30 08:21:41.023');
INSERT INTO public."ActivityLog" VALUES ('d2f4f3e2-4c07-4db8-8f0c-e802228bfee0', '364481a1-4af6-4357-af87-304ddd5b7b9b', 'CREATE', 'VehicleInventory', '0242b681-1aac-4184-afb4-fc7ef7f3a278', '{"vin": "ME4JK452DTW013173", "color": "NHC75 (PEARL DEEP", "indexNo": "D1-P7", "modelName": "CB Dio BS6 125 STD"}', '2026-08-30 08:21:41.242');
INSERT INTO public."ActivityLog" VALUES ('845feec2-9868-48a1-8907-cebbaf861383', '364481a1-4af6-4357-af87-304ddd5b7b9b', 'CREATE', 'VehicleInventory', 'e89a0e9f-ddf9-4c7d-810a-fea2fe3105c2', '{"vin": "ME4JK450GTW018207", "color": "R393 (SPORT RED 2)", "indexNo": "D1-P8", "modelName": "CB Dio BS6 125 STD"}', '2026-08-30 08:21:41.448');
INSERT INTO public."ActivityLog" VALUES ('d328a633-4aed-43f6-a307-dc78c0d9174d', '364481a1-4af6-4357-af87-304ddd5b7b9b', 'CREATE', 'VehicleInventory', 'ed0bc414-73fe-4744-b10a-1768358cb662', '{"vin": "ME4JK452GTW016036", "color": "NH303 (MAT AXIS GRAY", "indexNo": "D1-P9", "modelName": "CB Dio BS6 125 STD"}', '2026-08-30 08:21:41.658');
INSERT INTO public."ActivityLog" VALUES ('618db91b-a25d-488e-ac29-682c69fb438f', '364481a1-4af6-4357-af87-304ddd5b7b9b', 'CREATE', 'VehicleInventory', '7d8e49a1-1fd7-4d31-a9f2-9a6f131dcb37', '{"vin": "ME4JK452ETW014073", "color": "NHC75 (PEARL DEEP", "indexNo": "D1-P10", "modelName": "CB Dio BS6 125 STD"}', '2026-08-30 08:21:41.863');
INSERT INTO public."ActivityLog" VALUES ('9bfc245b-be1e-4904-aeac-f6b951df5a3d', '364481a1-4af6-4357-af87-304ddd5b7b9b', 'CREATE', 'VehicleInventory', '4a100088-768c-41df-b0fd-26a61eeffb7c', '{"vin": "ME4JK452DTW013151", "color": "NHC75 (PEARL DEEP", "indexNo": "D1-P11", "modelName": "CB Dio BS6 125 STD"}', '2026-08-30 08:21:42.068');
INSERT INTO public."ActivityLog" VALUES ('0bdabd46-99e2-4b9b-b95d-a9ddcffc9e25', '364481a1-4af6-4357-af87-304ddd5b7b9b', 'CREATE', 'VehicleInventory', '25bd345a-5080-46d6-badf-3c4073d1808f', '{"vin": "ME4JK452GTW016043", "color": "NH303 (MAT AXIS GRAY", "indexNo": "D1-P12", "modelName": "CB Dio BS6 125 STD"}', '2026-08-30 08:21:42.276');
INSERT INTO public."ActivityLog" VALUES ('ac11b6c3-2bb1-483b-ad57-247f3fb767a7', '364481a1-4af6-4357-af87-304ddd5b7b9b', 'CREATE', 'VehicleInventory', 'b409688c-b3ca-47d3-a4df-13b158a1cb96', '{"vin": "ME4JC85KCTD004937", "color": "NH1 (BLACK)", "indexNo": "D1-P13", "modelName": "SP Shine BS6 DSS"}', '2026-08-30 08:21:42.482');


--
-- Data for Name: AdminNotification; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

INSERT INTO public."AdminNotification" VALUES ('88628ed7-1fd5-4722-84de-d23a4bf0fb3e', 'DIGITAL_QUOTATION', 'New Digital Quotation Request', 'Success Bhattarai requested a quotation for Honda Dio BS6 110.', '/admin/crm/quotations', false, '2026-08-27 07:03:56.542');


--
-- Data for Name: AmcBooking; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--



--
-- Data for Name: AmcPlan; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

INSERT INTO public."AmcPlan" VALUES ('5f899f6f-8dc9-48a0-9178-265b964cd7e1', '3 Year', 3800, 7717, '[{"text": "12 Free Servicing Coupons: Worth Rs. 7,800/- ", "subtext": "(१२ निःशुल्क सर्भिस कुपन रु. ७,८००/- बराबरको)"}, {"text": "10% Discount on Spare Parts and Engine Oil", "subtext": " (स्पेयर पार्ट्स र इन्जिन आयलमा १०% छुट)"}, {"text": "40% Discount on Labour Charges for unscheduled servicing", "subtext": " (नियमित सर्भिसिङ्ग बाहेक अन्य मर्मतमा लेबर चार्ज ४०% छुट)"}, {"text": "Quick Service express facility without waiting in line", "subtext": " (लाईनमा बस्न नपर्ने गरी ग्राहकलाई Quick Service को सुविधा दिइने)"}, {"text": "6 Additional Free Washes ", "subtext": "(थप ६ वटा निःशुल्क वासिङ)"}, {"text": "6 Months Warranty on engine repairs ", "subtext": "(इन्जिन मर्मतमा ६ महिना बारेन्टी)"}, {"text": "Tax & Insurance Payment Service", "subtext": " (सवारी कर र बीमा भुक्तानी सेवा)"}, {"text": "Free Towing & On-Road Service up to 10 km", "subtext": " (ग्राहकलाई Towing र On road सर्भिसको सुविधा - १० कि.मि सम्म; रकम प्रति कि.मि रु. ५० को दरले)"}, {"text": "Free Vehicle Valuation", "subtext": " (निःशुल्क मूल्याङ्कन)"}]', false, true, 2, '2026-08-30 03:43:55.989', '2026-08-30 07:05:29.578');
INSERT INTO public."AmcPlan" VALUES ('6e8eb528-b8c6-470b-a15d-029af0717427', '1 Year', 1400, 2635, '[{"text": "4 Free Servicing Coupons: Worth Rs. 2,600/-", "subtext": "(४ निःशुल्क सर्भिस कुपन रु. २,६००/- बराबरको)"}, {"text": "5% Discount on Spare Parts and Engine Oil", "subtext": " (स्पेयर पार्ट्स र इन्जिन आयलमा ५% छुट)"}, {"text": "25% Discount on Labour Charges for unscheduled servicing ", "subtext": "(नियमित सर्भिसिङ्ग बाहेक अन्य मर्मतमा लेबर चार्ज २५% छुट)"}, {"text": "Priority Service timing provided during servicing ", "subtext": "(सर्भिसिङ्गको समयमा प्राथमिकता दिइने)"}, {"text": "2 Additional Free Washes ", "subtext": "(थप २ वटा निःशुल्क वासिङ)"}, {"text": "Free Towing & On-Road Service up to 10 km ", "subtext": "(ग्राहकलाई Towing र On road सर्भिसको सुविधा - १० कि.मि सम्म; प्रति कि.मि रु. ५० को दरले)"}]', false, true, 1, '2026-08-26 16:36:27.942', '2026-08-30 07:03:52.625');
INSERT INTO public."AmcPlan" VALUES ('5a82cffb-e7ad-4118-9f0b-8d8729d0dc2f', '5 Year', 6000, 13850, '[{"text": "20 Free Servicing Coupons: Worth Rs. 13,000/-", "subtext": "(२० निःशुल्क सर्भिस कुपन रु. १३,०००/- बराबरको)"}, {"text": "10% Discount on Spare Parts and Engine Oil.", "subtext": "(स्पेयर पार्ट्स र इन्जिन आयलमा १०% छुट)."}, {"text": "50% Discount on Labour Charges for unscheduled/extra servicing", "subtext": "(नियमिह सर्भिसिङ्ग बाहेक अन्य नगराउला लेबर चार्जमा ५०% छुट)."}, {"text": "10 Additional Free Washes", "subtext": " (थप १० वटा निःशुल्क वासिङ)"}, {"text": "6 Months Warranty on engine repairs ", "subtext": "(इन्जिन मर्मतमा ६ महिना बारेन्टी)"}, {"text": "Free Towing & On-Road Service up to 10 km ", "subtext": "(ग्राहकलाई Towing र On road सर्भिसको सुविधा - १० कि.मि सम्म निःशुल्क)"}, {"text": "Quick Service express facility without waiting in line ", "subtext": "(लाईनमा बस्न नपर्ने गरी ग्राहकलाई Quick Service को सुविधा दिइने)"}, {"text": "Tax & Insurance Payment Service ", "subtext": "(सवारी कर र बीमा भुक्तानी सेवा)"}, {"text": "Rs. 5,000/- Special Discount / Cashback on exchange for new Honda purchase ", "subtext": "(एक्सचेञ्जमा रु. ५०००/- सम्म छुट - नयाँ होण्डा खरिदको लागि)"}, {"text": "Free Vehicle Valuation ", "subtext": "(निःशुल्क मूल्याङ्कन)"}]', false, true, 3, '2026-08-30 06:18:53.724', '2026-08-30 07:07:28.642');


--
-- Data for Name: Blog; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--



--
-- Data for Name: Branch; Type: TABLE DA