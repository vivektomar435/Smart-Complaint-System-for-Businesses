# Smart-Complaint-System-for-Businesses

Smart Complain — AI-Powered Complaint Management Platform
Smart Complain is a SaaS complaint management platform that helps businesses collect, track, and resolve customer complaints. A lightweight embeddable widget lets customers submit complaints directly from any business website. Those complaints appear in the business owner's dashboard for review and resolution. Platform administrators have a separate panel for system-wide oversight.

The Problem This Solves
Most businesses manage complaints through WhatsApp, emails, or spreadsheets. Complaints get lost, nothing is tracked, and there is no data on recurring issues. Customers who are ignored leave quietly and write negative reviews. Smart Complain gives every business a proper complaint channel with full visibility from submission to resolution.

Project Structure
index.html is the login and registration portal for business owners and admins.
style.css and script.js handle the portal styling, form validation, view transitions, and user storage for the demo.
dashboard.html and dashboard.css make up the business owner single-page dashboard with views for complaints, analytics, settings, and integration.
widget.js is the self-contained embeddable widget with no external dependencies.
widget-demo.html is a sample e-commerce site showing the widget embedded in a real context.
admin.html is the platform admin panel for managing all businesses and complaints.

Current Features
Login and Registration
The portal opens with role selection between Business Owner and Admin. New business owners register with their business name, owner name, email, password, industry type, complaint volume estimate, and phone number. Duplicate emails are caught with an inline error. Existing users log in with email and password. Failed logins trigger a shake animation and a red error message. Successful actions show a green toast and redirect appropriately.
Business Owner Dashboard
The dashboard has four views.
Complaints View shows all complaints as cards with the customer name, date, category, description excerpt, and a colour-coded priority badge. Critical is red, High is yellow-orange, Medium is blue, Low is green. AI-processed complaints show a purple badge and a one-line reasoning summary. Filters narrow the list by status and priority without a page reload.
Analytics View shows total complaints, resolved complaints, average resolution time, and satisfaction score in a stat grid ready for charts in the backend version.
Settings View has notification toggles for email, SMS, and push alerts, plus a widget customisation panel for brand colour, button label, position, and language. The embed code updates live as settings change.
Integration View is a three-step flow covering API key management, the ready-to-copy script tag, and a live iframe preview of the configured widget.
Embeddable Widget
The widget is installed via a single script tag with data attributes for the API key, button label, brand colour, position, and language. It creates a floating button and a popup form collecting the customer name, email, category, and description. All fields are validated before submission. On success a confirmation screen appears and the popup closes automatically.
Supported languages are English, Arabic with automatic right-to-left layout, French, and Spanish. The widget is fully keyboard accessible, screen reader friendly, and mobile responsive.
Admin Panel
The admin panel shows all registered businesses and their statuses, all complaints across the platform, and aggregate analytics. Admins can suspend or reactivate businesses and manage any complaint in the system.

How to Run Locally
No build tools are required. Open index.html in a browser to use the portal, or open widget-demo.html to see the widget in action. For the widget to work without browser security warnings, run a simple local HTTP server from the project folder.

Future Roadmap
Phase 1 — Spring Boot Backend and PostgreSQL
The localStorage demo will be replaced with a Spring Boot REST API backed by PostgreSQL. All actions including registration, login, complaint submission, and resolution will connect to real endpoints. Login will return a JWT token used to authenticate subsequent requests. Core database tables will cover businesses, complaints, users, attachments, and notifications, with every complaint linked to its business for full tenant isolation.
Phase 2 — File and Image Attachments
Customers will be able to attach photos, screenshots, and PDFs to complaints from within the widget using a drag-and-drop upload area with thumbnail previews and a progress bar. On the backend, files are validated by content type, scanned for malware, then stored in AWS S3. Paths are saved in the attachments table and accessed through time-limited signed URLs. Free plan allows three attachments up to five megabytes each. Pro plan allows ten attachments up to twenty megabytes each.
Phase 3 — AI-Powered Classification
When a complaint is saved, a background job sends the text to a large language model. The model assigns a category if none was selected, sets a priority level, writes a one-line reasoning summary, and flags complaints with legal threats or safety concerns. Results are pushed to the dashboard in real time via WebSocket. The AI also generates a suggested draft reply the owner can edit or discard.
Phase 4 — Spring Security
Authentication will use JWT with a fifteen-minute access token and a seven-day refresh token in an HttpOnly cookie. Role-based access control gives owners full account access, agents the ability to view and resolve assigned complaints, viewers read-only access, and platform admins unrestricted access. API keys are hashed before storage, rate-limited per hour, and restricted to whitelisted domains. Accounts lock after five failed logins and all admin actions are written to an audit log.
Phase 5 — Scalability
The stateless backend allows horizontal scaling behind a load balancer with no session affinity required. PostgreSQL read replicas separate dashboard queries from write operations. Redis caches analytics queries for fast repeated access. Heavy operations like AI classification and file processing run asynchronously through a message queue so complaint submissions are never delayed. The widget file is served from a content delivery network targeting load times under fifty milliseconds globally. Production targets are complaint submission response under two hundred milliseconds and monthly uptime of 99.9 percent.

Business Model and Profitability
Smart Complain runs on monthly subscriptions at four tiers. The free plan covers one hundred complaints per month and builds the install base while passively marketing the platform through the widget footer branding. Starter adds AI features and team access for small businesses. Pro adds advanced analytics and higher limits for medium businesses. Business supports multiple properties under one account. Enterprise is custom-priced with dedicated infrastructure and SLA commitments.
Additional revenue comes from overage fees, white-label licensing for agencies, and professional services for enterprise onboarding. Margins are strong because marginal cost per new customer is low. High switching costs keep churn low since businesses that embed the widget and build up complaint history rarely move to another system.

Why It Works for Startups and Growing Businesses
Startups get a professional complaint channel from day one on the free plan. Complaint data immediately shows where the product has friction, which is valuable for early product decisions without separate research costs.
Growing businesses benefit from team workspaces, complaint assignment, and agent performance tracking as headcount increases. No custom development is needed.
Large businesses reduce legal and reputational risk through audit trails, escalation flags, and SLA tracking. The platform works across all industries because the core workflow of receive, classify, assign, and resolve is universal.

Technology Stack
The current frontend uses HTML5, CSS3, and vanilla JavaScript with no external libraries.
The planned backend uses Spring Boot 3 with Java 21, Spring Security with JWT, PostgreSQL 16, Spring Data JPA with Hibernate, Redis for caching, AWS S3 for file storage, RabbitMQ for async jobs, a large language model API for AI features, a content delivery network for widget distribution, Docker and Kubernetes for deployment, GitHub Actions for CI/CD, and Grafana with Prometheus for monitoring.
---
Contributing
Useful contribution areas are the Spring Boot backend implementation, additional widget languages, analytics chart components, accessibility improvements, and test coverage. Fork the repository, work in a named branch, and open a pull request with a clear description of the changes.
