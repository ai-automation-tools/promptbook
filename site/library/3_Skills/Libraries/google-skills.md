---
title: "google/skills"
description: "Agent Skills for Google products and technologies"
repo: google/skills
tags: ["skill","skill-library","google","googlecloud"]
---
# google/skills

Agent Skills for Google products and technologies

A skill library: browse and install its skills from [the repo on GitHub](https://github.com/google/skills). Promptbook keeps one card for it rather than a copy of each skill.

---

*The repo's README, copied 2026-11-24:*

# Agent Skills

[![Install via skills.sh](https://img.shields.io/badge/skills.sh-install-green)](https://skills.sh/google/skills)

This repository contains [Agent Skills](https://agentskills.io/home) for Google
products and technologies, including [Google Cloud](https://cloud.google.com).

## Installation

```bash
npx skills add google/skills
```

When prompted, select specific skills or all skills, the target agents to
configure, and the installation scope (project or global).

If `npx` is not available in your environment, install
[Node.js](https://nodejs.org/en/download), which includes `npm` and `npx`.

## Updating Skills

To update previously installed skills to the latest versions, run the following
command.

```bash
npx skills update
```

This command gives you an option to also remove obsolete skills.

## Available Skills

<!-- BEGIN SKILLS -->
- **Getting started with Google Cloud**
  - [**Authenticating and Authorizing to Google Cloud (IAM)**](https://github.com/google/skills/blob/main/skills/cloud/google-cloud-recipe-auth)
  - [**Google Cloud Recipe: Foundation Builder**](https://github.com/google/skills/blob/main/skills/cloud/google-cloud-recipe-foundation-builder)
  - [**Onboarding to Google Cloud**](https://github.com/google/skills/blob/main/skills/cloud/google-cloud-recipe-onboarding)
- **Multi-product solution skills**
  - [**Google Cloud solution-architecture workflow**](https://github.com/google/skills/blob/main/skills/cloud/google-cloud-solution-architecture)
  - [**Agent Gateway multi-agent security**](https://github.com/google/skills/blob/main/skills/cloud/google-cloud-solution-multi-agent-security)
  - [**Agentic analytics across cloud providers and data types**](https://github.com/google/skills/blob/main/skills/cloud/google-cloud-solution-agentic-analytics-spark-knowledge-catalog)
  - [**Borderless open data lakehouse agentic AI system**](https://github.com/google/skills/blob/main/skills/cloud/google-cloud-solution-agentic-ai-borderless-data-lakehouse)
  - [**Build and deploy AI agents on Google Cloud**](https://github.com/google/skills/blob/main/skills/cloud/google-cloud-solution-build-deploy-agents)
  - [**Data science workflow with AI agents solution**](https://github.com/google/skills/blob/main/skills/cloud/google-cloud-solution-agentic-ai-data-science-workflow)
  - [**Dynamic Hybrid Search using AlloyDB**](https://github.com/google/skills/blob/main/skills/cloud/google-cloud-solution-hybrid-search-alloydb)
  - [**Event-driven decoupling with Pub/Sub**](https://github.com/google/skills/blob/main/skills/cloud/google-cloud-solution-event-driven-decoupling)
  - [**Google Skill Finder**](https://github.com/google/skills/blob/main/skills/developers/finding-google-skills)
  - [**Live bidirectional multimodal streaming agentic AI solution**](https://github.com/google/skills/blob/main/skills/cloud/google-cloud-solution-agentic-ai-bidirectional-streaming)
  - [**Migrate AI Workloads to GKE Inference**](https://github.com/google/skills/blob/main/skills/cloud/google-cloud-solution-guided-gke-ai-migration)
  - [**RAG for enterprise search using GKE and AlloyDB**](https://github.com/google/skills/blob/main/skills/cloud/google-cloud-solution-rag-enterprise-search-gke-sqldb)
  - [**Secure n-tier serverless web application with strict private application tiers**](https://github.com/google/skills/blob/main/skills/cloud/google-cloud-solution-n-tier-serverless-web-app)
- **AI/ML**
  - [**Agent Access Audit**](https://github.com/google/skills/blob/main/skills/cloud/agent-platform-access-audit)
  - [**Agent Platform Alert Configuration**](https://github.com/google/skills/blob/main/skills/cloud/agent-platform-alert-configuration)
  - [**Agent Platform Autorater Customization**](https://github.com/google/skills/blob/main/skills/cloud/agent-platform-autorater-customization)
  - [**Agent Platform Endpoint Management**](https://github.com/google/skills/blob/main/skills/cloud/agent-platform-endpoint-management)
  - [**Agent Platform Eval Flywheel Skill**](https://github.com/google/skills/blob/main/skills/cloud/agent-platform-eval-flywheel)
  - [**Agent Platform GenAI Inference Skill**](https://github.com/google/skills/blob/main/skills/cloud/agent-platform-inference)
  - [**Agent Platform Model Garden Deploy Skill**](https://github.com/google/skills/blob/main/skills/cloud/agent-platform-deploy)
  - [**Agent Platform Model Registry Management**](https://github.com/google/skills/blob/main/skills/cloud/agent-platform-model-registry)
  - [**Agent Platform Model Tuning**](https://github.com/google/skills/blob/main/skills/cloud/agent-platform-tuning)
  - [**Agent Platform Prompt Management**](https://github.com/google/skills/blob/main/skills/cloud/agent-platform-prompt-management)
  - [**Agent Platform RAG Engine Management**](https://github.com/google/skills/blob/main/skills/cloud/agent-platform-rag-engine-management)
  - [**Agent Platform Troubleshooting**](https://github.com/google/skills/blob/main/skills/cloud/agent-platform-troubleshooting)
  - [**Agent Platform Tuning Management**](https://github.com/google/skills/blob/main/skills/cloud/agent-platform-tuning-management)
  - [**API Gateway Remote MCP Server (Public Preview)**](https://github.com/google/skills/blob/main/skills/cloud/api-gateway-mcp-server)
  - [**Apigee as an Agent Gateway Service Extension**](https://github.com/google/skills/blob/main/skills/cloud/apigee-agent-gateway-governance)
  - [**BigQuery AI & ML**](https://github.com/google/skills/blob/main/skills/cloud/bigquery-ai-ml)
  - [**Gemini API in Gemini platform**](https://github.com/google/skills/blob/main/skills/cloud/gemini-api)
  - [**Gemini Enterprise Agent Platform - Managed Agents API Skill**](https://github.com/google/skills/blob/main/skills/cloud/gemini-agents-api)
  - [**Gemini Interactions API Skill**](https://github.com/google/skills/blob/main/skills/cloud/gemini-interactions-api)
  - [**Gemini platform Architecture and Engineering Guide**](https://github.com/google/skills/blob/main/skills/cloud/agent-platform-architecture)
  - [**Genkit Dart**](https://github.com/google/skills/blob/main/skills/cloud/developing-genkit-dart)
  - [**Genkit Go**](https://github.com/google/skills/blob/main/skills/cloud/developing-genkit-go)
  - [**Genkit JS**](https://github.com/google/skills/blob/main/skills/cloud/developing-genkit-js)
  - [**Genkit Python**](https://github.com/google/skills/blob/main/skills/cloud/developing-genkit-python)
  - [**Google Cloud Agent Registry**](https://github.com/google/skills/blob/main/skills/cloud/agent-platform-agent-registry)
  - [**LiteRT on Google Tensor: compile, benchmark, package for apps**](https://github.com/google/skills/blob/main/skills/platform-devices/litert-google-tensor)
  - [**LiveAPI Service Skill**](https://github.com/google/skills/blob/main/skills/cloud/gemini-live-api)
  - [**Migrating from Gemini API in AI Studio to Agent Platform**](https://github.com/google/skills/blob/main/skills/cloud/agent-platform-migrate-from-ai-studio)
  - [**Pathways on Cloud Workload Debugging Skill**](https://github.com/google/skills/blob/main/skills/cloud/pathways-workload)
  - [**Skill Registry**](https://github.com/google/skills/blob/main/skills/cloud/agent-platform-skill-registry)
  - [**Troubleshoot GKE TPU multi-slice hangs with the MXLA Hang Analyzer**](https://github.com/google/skills/blob/main/skills/cloud/gke-ai-troubleshooting-tpu-mxla-hang)
  - [**Troubleshoot GKE TPU performance degradation with ML Diagnostics Workload Monitoring**](https://github.com/google/skills/blob/main/skills/cloud/gke-ai-troubleshooting-tpu-performance-degradation)
- **Infrastructure**
  - [**Cloud Network Insights**](https://github.com/google/skills/blob/main/skills/cloud/cloud-network-insights)
  - [**Cloud Storage Basics**](https://github.com/google/skills/blob/main/skills/cloud/google-cloud-storage-basics)
  - [**Cloud Storage Bucket Architect**](https://github.com/google/skills/blob/main/skills/cloud/google-cloud-storage-bucket-architect)
  - [**Cloud Storage Diagnostic**](https://github.com/google/skills/blob/main/skills/cloud/google-cloud-storage-diagnostic)
  - [**Cloud Storage FUSE**](https://github.com/google/skills/blob/main/skills/cloud/google-cloud-storage-fuse)
  - [**Compute Engine Future Reservations & Calendar-Mode Feasibility**](https://github.com/google/skills/blob/main/skills/cloud/compute-future-reservations)
  - [**Compute Engine Managed Instance Group (MIG) Autoscaling Troubleshooting**](https://github.com/google/skills/blob/main/skills/cloud/compute-mig-autoscaling-troubleshooting)
  - [**Compute Engine On-Demand Reservations**](https://github.com/google/skills/blob/main/skills/cloud/compute-on-demand-reservations)
  - [**Compute Engine Resource Availability and Stockout Troubleshooting**](https://github.com/google/skills/blob/main/skills/cloud/compute-resource-availability-troubleshooting)
  - [**Compute Engine Spot Capacity Advice**](https://github.com/google/skills/blob/main/skills/cloud/compute-spot-capacity-advice)
  - [**Compute Engine VM Creation**](https://github.com/google/skills/blob/main/skills/cloud/compute-vm-creation)
  - [**Compute Engine VM Host Events & Infrastructure Crash Troubleshooting**](https://github.com/google/skills/blob/main/skills/cloud/compute-host-events-troubleshooting)
  - [**Designing and Deploying GCP Infrastructure with Application Design Center**](https://github.com/google/skills/blob/main/skills/cloud/application-design-center-design-deploy)
  - [**Filestore Auditing Skill**](https://github.com/google/skills/blob/main/skills/cloud/google-cloud-filestore-auditing)
  - [**Filestore Autoscale**](https://github.com/google/skills/blob/main/skills/cloud/google-cloud-filestore-autoscale)
  - [**Filestore Log-Based Troubleshooting**](https://github.com/google/skills/blob/main/skills/cloud/google-cloud-filestore-log-troubleshooting)
  - [**Filestore NFS File Browser**](https://github.com/google/skills/blob/main/skills/cloud/google-cloud-filestore-nfs-browser)
  - [**GKE AI/ML Inference**](https://github.com/google/skills/blob/main/skills/cloud/gke-inference)
  - [**GKE Alert Configuration**](https://github.com/google/skills/blob/main/skills/cloud/gke-alert-configuration)
  - [**GKE App Onboarding**](https://github.com/google/skills/blob/main/skills/cloud/gke-app-onboarding)
  - [**GKE Backup & Disaster Recovery**](https://github.com/google/skills/blob/main/skills/cloud/gke-backup-dr)
  - [**GKE Basics & Critical Gotchas**](https://github.com/google/skills/blob/main/skills/cloud/gke-basics)
  - [**GKE Batch & HPC Workloads**](https://github.com/google/skills/blob/main/skills/cloud/gke-batch-hpc)
  - [**GKE Cluster Autoscaler**](https://github.com/google/skills/blob/main/skills/cloud/gke-cluster-autoscaler)
  - [**GKE Cluster Creation**](https://github.com/google/skills/blob/main/skills/cloud/gke-cluster-creation)
  - [**GKE ComputeClasses**](https://github.com/google/skills/blob/main/skills/cloud/gke-compute-classes)
  - [**GKE Golden Base Image Discovery Expert**](https://github.com/google/skills/blob/main/skills/cloud/gke-custom-golden-image-discovery)
  - [**GKE Golden Path Configuration**](https://github.com/google/skills/blob/main/skills/cloud/gke-golden-path)
  - [**GKE JobSet Interruption Troubleshooting**](https://github.com/google/skills/blob/main/skills/cloud/gke-ai-troubleshooting-jobset-interruption)
  - [**GKE Kueue troubleshooting**](https://github.com/google/skills/blob/main/skills/cloud/gke-kueue-troubleshooting)
  - [**GKE Manifest Generation Skill**](https://github.com/google/skills/blob/main/skills/cloud/gke-manifest-generation)
  - [**GKE Multi-Tenancy**](https://github.com/google/skills/blob/main/skills/cloud/gke-multitenancy)
  - [**GKE Networking**](https://github.com/google/skills/blob/main/skills/cloud/gke-networking)
  - [**GKE Node NotReady Troubleshooting Skill**](https://github.com/google/skills/blob/main/skills/cloud/gke-node-notready)
  - [**GKE Productionize Skill**](https://github.com/google/skills/blob/main/skills/cloud/gke-productionize)
  - [**GKE Reliability**](https://github.com/google/skills/blob/main/skills/cloud/gke-reliability)
  - [**GKE Service Networking Skill**](https://github.com/google/skills/blob/main/skills/cloud/gke-service-networking)
  - [**GKE StatefulSet without readiness probes**](https://github.com/google/skills/blob/main/skills/cloud/gke-statefulset-without-probes)
  - [**GKE Storage**](https://github.com/google/skills/blob/main/skills/cloud/gke-storage)
  - [**GKE Storage Troubleshooting Skill**](https://github.com/google/skills/blob/main/skills/cloud/gke-storage-troubleshooting)
  - [**GKE TPU Dynamic Slices Monitoring & Management**](https://github.com/google/skills/blob/main/skills/cloud/gke-ai-troubleshooting-tpu-dynamic-slices-monitoring)
  - [**GKE unprotected StatefulSet skill**](https://github.com/google/skills/blob/main/skills/cloud/gke-unprotected-statefulset)
  - [**GKE Upgrades & Maintenance**](https://github.com/google/skills/blob/main/skills/cloud/gke-upgrades)
  - [**GKE Workload Scaling**](https://github.com/google/skills/blob/main/skills/cloud/gke-workload-scaling)
  - [**GKE Workload Scaling Troubleshooting Skill**](https://github.com/google/skills/blob/main/skills/cloud/gke-workload-scaling-troubleshooting)
  - [**GKE Workload Troubleshooting Skill**](https://github.com/google/skills/blob/main/skills/cloud/gke-workload-troubleshooting)
  - [**Google Cloud global external Application Load Balancer Configuration Skill**](https://github.com/google/skills/blob/main/skills/cloud/google-cloud-global-frontend-configuration)
  - [**Google Cloud Networking Observability Expert**](https://github.com/google/skills/blob/main/skills/cloud/google-cloud-networking-observability)
  - [**Triage GKE capacity constraints for a Pending workload**](https://github.com/google/skills/blob/main/skills/cloud/gke-capacity-triage)
  - [**Troubleshoot GKE TPU reservation stockouts caused by leaked node pool capacity**](https://github.com/google/skills/blob/main/skills/cloud/gke-ai-troubleshooting-tpu-reservation-stockout)
  - [**Troubleshoot GKE TPU slice creation blocked by an unstable MIG**](https://github.com/google/skills/blob/main/skills/cloud/gke-ai-troubleshooting-tpu-slice-mig-stuck-updating)
  - [**Troubleshoot GKE TPU VMs stuck in Compute Engine repair (`REPAIRING`)**](https://github.com/google/skills/blob/main/skills/cloud/gke-ai-troubleshooting-tpu-vm-repair-stuck)
  - [**Troubleshoot TPU slice creation failures caused by partition overlap**](https://github.com/google/skills/blob/main/skills/cloud/gke-ai-troubleshooting-tpu-partition-overlap)
  - [**Troubleshoot unresponsive GKE TPU and GPU nodes (`NodeStatusUnknown`)**](https://github.com/google/skills/blob/main/skills/cloud/gke-ai-troubleshooting-node-unresponsive-timeout)
- **Databases and analytics**
  - [**AlloyDB Basics**](https://github.com/google/skills/blob/main/skills/cloud/alloydb-basics)
  - [**BigFrames (BigQuery DataFrame) basics**](https://github.com/google/skills/blob/main/skills/cloud/bigquery-bigframes)
  - [**BigQuery Asset Impact Analysis**](https://github.com/google/skills/blob/main/skills/cloud/datalineage-bigquery-asset-impact-analysis)
  - [**BigQuery Basics**](https://github.com/google/skills/blob/main/skills/cloud/bigquery-basics)
  - [**BigQuery Migration Data Exporter**](https://github.com/google/skills/blob/main/skills/cloud/bigquery-migration-data-exporter)
  - [**BigQuery Migration Data Loader**](https://github.com/google/skills/blob/main/skills/cloud/bigquery-migration-data-loader)
  - [**BigQuery Migration Metadata Extraction**](https://github.com/google/skills/blob/main/skills/cloud/bigquery-migration-metadata-extractor)
  - [**BigQuery Migration Service (BQMS) SQL Translator**](https://github.com/google/skills/blob/main/skills/cloud/bigquery-migration-sql-translator)
  - [**BigQuery Migration Validator**](https://github.com/google/skills/blob/main/skills/cloud/bigquery-migration-validator)
  - [**BigQuery Observability**](https://github.com/google/skills/blob/main/skills/cloud/bigquery-observability)
  - [**BigQuery Optimization Workflow**](https://github.com/google/skills/blob/main/skills/cloud/bigquery-optimization)
  - [**BigQuery Troubleshooting**](https://github.com/google/skills/blob/main/skills/cloud/bigquery-troubleshooting)
  - [**BigQuery User-Defined Functions (UDFs)**](https://github.com/google/skills/blob/main/skills/cloud/bigquery-udfs)
  - [**Bigtable Basics**](https://github.com/google/skills/blob/main/skills/cloud/bigtable-basics)
  - [**Cloud SQL Basics**](https://github.com/google/skills/blob/main/skills/cloud/cloud-sql-basics)
  - [**Data Lineage Summary**](https://github.com/google/skills/blob/main/skills/cloud/datalineage-summary)
  - [**dbt Snowflake to BigQuery Translator**](https://github.com/google/skills/blob/main/skills/cloud/dbt-sf-to-bq-translator)
  - [**GCP Managed Airflow DAG Authoring Guide**](https://github.com/google/skills/blob/main/skills/cloud/managed-airflow-dag-authoring)
  - [**Google Cloud Database Onboarding Skill**](https://github.com/google/skills/blob/main/skills/cloud/cloud-databases-onboarding)
  - [**Managed Service for Apache Airflow (formerly Cloud Composer) DAG troubleshooting guide**](https://github.com/google/skills/blob/main/skills/cloud/managed-airflow-dag-troubleshooting)
  - [**Managed Service for Apache Airflow (formerly Cloud Composer) Migration Guide**](https://github.com/google/skills/blob/main/skills/cloud/managed-airflow-migrations)
  - [**Managed Service for Apache Airflow (formerly Cloud Composer) recommendations**](https://github.com/google/skills/blob/main/skills/cloud/managed-airflow-recommendations)
  - [**Spanner Basics**](https://github.com/google/skills/blob/main/skills/cloud/spanner-basics)
  - [**Spanner Graph Query Tuning Best Practices**](https://github.com/google/skills/blob/main/skills/cloud/spanner-graph-query-tuning)
  - [**Spanner Graph Schema Design & Topology Best Practices**](https://github.com/google/skills/blob/main/skills/cloud/spanner-graph-schema-best-practices)
  - [**Spanner Relational-to-Property-Graph Schema Conversion**](https://github.com/google/skills/blob/main/skills/cloud/spanner-relational-to-graph)
- **Developer tools**
  - [**Cloud Build Basics**](https://github.com/google/skills/blob/main/skills/cloud/cloud-build-basics)
  - [**Cloud Deploy Pipelines**](https://github.com/google/skills/blob/main/skills/cloud/google-cicd-release-orchestration)
  - [**Cloud Operator**](https://github.com/google/skills/blob/main/skills/cloud/cloud-operator)
  - [**Developer Device Platform**](https://github.com/google/skills/blob/main/skills/cloud/developer-device-platform-basics)
  - [**Developer Device Platform: Device Run**](https://github.com/google/skills/blob/main/skills/cloud/developer-device-platform-device-run)
  - [**gcloud CLI Skill for AI Agents**](https://github.com/google/skills/blob/main/skills/cloud/gcloud)
  - [**Gerrit Code Review**](https://github.com/google/skills/blob/main/skills/developers/gerrit-code-review)
  - [**Google Agents CLI Onboarding**](https://github.com/google/skills/blob/main/skills/cloud/google-agents-cli-onboarding)
  - [**Google Cloud CI/CD Deployment**](https://github.com/google/skills/blob/main/skills/cloud/google-cicd-deploy)
  - [**Google Cloud CI/CD Pipeline Design**](https://github.com/google/skills/blob/main/skills/cloud/google-cicd-pipeline-design)
  - [**Google Cloud Release Radar**](https://github.com/google/skills/blob/main/skills/cloud/google-cloud-release-radar)
  - [**Google Developer Knowledge**](https://github.com/google/skills/blob/main/skills/developers/retrieving-developer-knowledge)
  - [**Set up the operator agent**](https://github.com/google/skills/blob/main/skills/cloud/cloud-operator-setup)
  - [**Share existing Google Cloud context with the operator agent**](https://github.com/google/skills/blob/main/skills/cloud/cloud-operator-share-context)
  - [**Terraform GCP Skill**](https://github.com/google/skills/blob/main/skills/cloud/google-cicd-terraform)
- **Application development**
  - [**API Gateway OpenAPI Spec Authoring**](https://github.com/google/skills/blob/main/skills/cloud/api-gateway-openapi-spec-authoring)
  - [**Application Integration Authoring**](https://github.com/google/skills/blob/main/skills/cloud/application-integration-authoring)
  - [**Application Integration Basics**](https://github.com/google/skills/blob/main/skills/cloud/application-integration-basics)
  - [**Application Integration Troubleshooting**](https://github.com/google/skills/blob/main/skills/cloud/application-integration-troubleshooting)
  - [**Migrate Legacy Codebases to Safe Rust**](https://github.com/google/skills/blob/main/skills/developers/migrate-to-rust)
- **Management tools**
  - [**Cloud Logging Finops**](https://github.com/google/skills/blob/main/skills/cloud/cloud-logging-finops)
  - [**Cloud Monitoring Chart Generation Skill (`cloud-monitoring-chart-generation`)**](https://github.com/google/skills/blob/main/skills/cloud/cloud-monitoring-chart-generation)
  - [**Cloud Monitoring ListTimeSeries Request Generator**](https://github.com/google/skills/blob/main/skills/cloud/cloud-monitoring-list-time-series-request)
  - [**Cloud Monitoring Notification Channels Configuration**](https://github.com/google/skills/blob/main/skills/cloud/cloud-monitoring-notification-channels-configuration)
  - [**Cloud Monitoring PromQL Generator**](https://github.com/google/skills/blob/main/skills/cloud/cloud-monitoring-promql-query)
  - [**Cloud Trace Querying Skill (`cloud-trace-querying`)**](https://github.com/google/skills/blob/main/skills/cloud/cloud-trace-querying)
  - [**Configure Cloud Monitoring Alerts**](https://github.com/google/skills/blob/main/skills/cloud/cloud-monitoring-alert-configuration)
  - [**Configuring Cloud Logging**](https://github.com/google/skills/blob/main/skills/cloud/cloud-logging-configuration-basics)
  - [**Configuring Cross-Project Logging**](https://github.com/google/skills/blob/main/skills/cloud/cloud-logging-cross-project-configuration)
  - [**Generate Logging Query Language queries**](https://github.com/google/skills/blob/main/skills/cloud/cloud-logging-query-generation)
  - [**GKE Cost Analysis**](https://github.com/google/skills/blob/main/skills/cloud/gke-cost-analysis)
  - [**GKE Cost Optimization**](https://github.com/google/skills/blob/main/skills/cloud/gke-cost-optimization)
  - [**GKE Observability**](https://github.com/google/skills/blob/main/skills/cloud/gke-observability)
  - [**GKE TPU Metrics Monitoring Guide**](https://github.com/google/skills/blob/main/skills/cloud/gke-ai-troubleshooting-tpu-metrics-monitoring)
  - [**Handle Disruption on GPUs and TPUs Troubleshooting**](https://github.com/google/skills/blob/main/skills/cloud/gke-ai-troubleshooting-handle-disruption-gpu-tpu)
  - [**Metric Selection (Service Query & Local Keyword Filtering)**](https://github.com/google/skills/blob/main/skills/cloud/cloud-monitoring-metric-selection)
  - [**Personalized Service Health incident correlation**](https://github.com/google/skills/blob/main/skills/cloud/servicehealth-incident-correlation)
  - [**SLO Alert Configuration Setup Wizard**](https://github.com/google/skills/blob/main/skills/cloud/google-cloud-slo-alert-configuration)
  - [**TPU Connection Failure and VBAR OOM Troubleshooting**](https://github.com/google/skills/blob/main/skills/cloud/gke-ai-troubleshooting-tpu-vbar-oom)
  - [**Workload Manager Basics**](https://github.com/google/skills/blob/main/skills/cloud/workload-manager-basics)
- **Well-Architected Framework**
  - [**Google Cloud Well-Architected Framework skill for the Cost Optimization pillar**](https://github.com/google/skills/blob/main/skills/cloud/google-cloud-waf-cost-optimization)
  - [**Google Cloud Well-Architected Framework skill for the Operational Excellence pillar**](https://github.com/google/skills/blob/main/skills/cloud/google-cloud-waf-operational-excellence)
  - [**Google Cloud Well-Architected Framework skill for the Performance Optimization pillar**](https://github.com/google/skills/blob/main/skills/cloud/google-cloud-waf-performance-optimization)
  - [**Google Cloud Well-Architected Framework skill for the Reliability pillar**](https://github.com/google/skills/blob/main/skills/cloud/google-cloud-waf-reliability)
  - [**Google Cloud Well-Architected Framework skill for the Security, Privacy, and Compliance pillar**](https://github.com/google/skills/blob/main/skills/cloud/google-cloud-waf-security)
  - [**Google Cloud Well-Architected Framework skill for the Sustainability pillar**](https://github.com/google/skills/blob/main/skills/cloud/google-cloud-waf-sustainability)
- **Security and identity**
  - [**API Gateway Backend Security and Rate Limiting**](https://github.com/google/skills/blob/main/skills/cloud/api-gateway-backend-security-and-rate-limiting)
  - [**Cloud Armor OWASP Rule Upgrader (CRS 3.0/3.3 -> 4.22)**](https://github.com/google/skills/blob/main/skills/cloud/cloud-armor-crs-rule-upgrader)
  - [**Compliance Environment Assessor Skill**](https://github.com/google/skills/blob/main/skills/cloud/assuredworkloads-environment-assessor)
  - [**Custom Resource Authoring & Synthesis Skill (`assuredworkloads-frameworks-author`)**](https://github.com/google/skills/blob/main/skills/cloud/assuredworkloads-frameworks-author)
  - [**Data Boundary Framework Navigator (`assuredworkloads-frameworks-navigator`)**](https://github.com/google/skills/blob/main/skills/cloud/assuredworkloads-frameworks-navigator)
  - [**DPoP Adoption & Identity Security Architecture**](https://github.com/google/skills/blob/main/skills/identity/dpop-adoption)
  - [**GKE Platform Security**](https://github.com/google/skills/blob/main/skills/cloud/gke-platform-security)
  - [**GKE Workload Identity Federation Troubleshooting Skill**](https://github.com/google/skills/blob/main/skills/cloud/gke-workload-identity)
  - [**GKE Workload Security**](https://github.com/google/skills/blob/main/skills/cloud/gke-workload-security)
  - [**Google Cloud Assured Workloads Basics (V1 GA)**](https://github.com/google/skills/blob/main/skills/cloud/assured-workloads-basics)
  - [**Google Cloud Security Command Center Remediation**](https://github.com/google/skills/blob/main/skills/cloud/google-cloud-scc-remediation)
  - [**Google SecOps Case Management Skill for AI Agents**](https://github.com/google/skills/blob/main/skills/cloud/secops-cases)
  - [**Google SecOps Detection Engineering Skill**](https://github.com/google/skills/blob/main/skills/cloud/secops-detection-engineering)
  - [**Google SecOps Incident & Entity Investigation Skill**](https://github.com/google/skills/blob/main/skills/cloud/secops-investigate)
  - [**Google SecOps Security Alert Triage Specialist**](https://github.com/google/skills/blob/main/skills/cloud/secops-triage)
  - [**Google SecOps Threat Hunting Skill**](https://github.com/google/skills/blob/main/skills/cloud/secops-hunt)
  - [**IAM Access Troubleshooter & Remediation Orchestrator on Google Cloud**](https://github.com/google/skills/blob/main/skills/cloud/iam-helper-for-troubleshooting)
  - [**IAM Helper for Policy Management**](https://github.com/google/skills/blob/main/skills/cloud/iam-helper-for-policy-management)
  - [**IAM Policy Simulator (v1 Allow)**](https://github.com/google/skills/blob/main/skills/cloud/iam-helper-for-policy-simulator)
  - [**IAP troubleshooting for Gemini Enterprise Agent Platform**](https://github.com/google/skills/blob/main/skills/cloud/iap-agent-platform-troubleshooting)
  - [**Privileged Access Manager (PAM)**](https://github.com/google/skills/blob/main/skills/cloud/iam-helper-for-privileged-access-management)
  - [**SecOps Detection Coverage Skill**](https://github.com/google/skills/blob/main/skills/cloud/detection-engineering-coverage-evaluation)
  - [**Security Command Center Query Skill on Google Cloud**](https://github.com/google/skills/blob/main/skills/cloud/google-cloud-scc-query)
  - [**Sign In With Google (SiwG) Integration & Security Architecture**](https://github.com/google/skills/blob/main/skills/identity/sign-in-with-google-web)
- **Web and app hosting**
  - [**API Gateway Troubleshooting**](https://github.com/google/skills/blob/main/skills/cloud/api-gateway-troubleshooting)
  - [**Cloud Run Alert Configuration**](https://github.com/google/skills/blob/main/skills/cloud/cloud-run-alert-configuration)
  - [**Cloud Run Basics**](https://github.com/google/skills/blob/main/skills/cloud/cloud-run-basics)
  - [**Firebase Basics**](https://github.com/google/skills/blob/main/skills/cloud/firebase-basics)
- **Advertising**
  - [**AI Migration Agent Instructions for the Google Mobile Ads SDK**](https://github.com/google/skills/blob/main/skills/ads/google-mobile-ads-android-migrate-to-next-gen)
  - [**Data Manager API Audience Ingestion**](https://github.com/google/skills/blob/main/skills/ads/data-manager-api-audience-ingestion)
  - [**Data Manager API Event Ingestion**](https://github.com/google/skills/blob/main/skills/ads/data-manager-api-event-ingestion)
  - [**Data Manager API Setup**](https://github.com/google/skills/blob/main/skills/ads/data-manager-api-setup)
  - [**Data Manager API Troubleshooting**](https://github.com/google/skills/blob/main/skills/ads/data-manager-api-troubleshooting)
  - [**Google Ads API Account Performance Diagnostics Skill**](https://github.com/google/skills/blob/main/skills/ads/google-ads-api-account-diagnostics)
  - [**Google Ads API MCP Server Installation**](https://github.com/google/skills/blob/main/skills/ads/google-ads-api-mcp-setup)
  - [**Google Ads API Quickstart**](https://github.com/google/skills/blob/main/skills/ads/google-ads-api-quickstart)
  - [**Google Mobile Ads SDK - Banner Ads**](https://github.com/google/skills/blob/main/skills/ads/google-mobile-ads-banner)
  - [**Google Mobile Ads SDK - Install**](https://github.com/google/skills/blob/main/skills/ads/google-mobile-ads-get-started)
  - [**Google Mobile Ads SDK - Interstitial Ads**](https://github.com/google/skills/blob/main/skills/ads/google-mobile-ads-interstitial)
  - [**Google Mobile Ads SDK - Rewarded Ads**](https://github.com/google/skills/blob/main/skills/ads/google-mobile-ads-rewarded)
  - [**IMA DAI SDK**](https://github.com/google/skills/blob/main/skills/ads/ima-dai-sdk)
  - [**IMA SDK client-side**](https://github.com/google/skills/blob/main/skills/ads/ima-sdk-client-side)
  - [**Validate Google Mobile Ads SDK Integration**](https://github.com/google/skills/blob/main/skills/ads/google-mobile-ads-validate)
- **Others**
  - [**Getting Started with Google Analytics Admin API**](https://github.com/google/skills/blob/main/skills/analytics/google-analytics-admin-api-basics)
  - [**Getting Started with Google Analytics Data API**](https://github.com/google/skills/blob/main/skills/analytics/google-analytics-data-api-basics)
<!-- END SKILLS -->

## Additional Google skills

-   [**Advanced Google Cloud Storage Skills**](https://github.com/gemini-cli-extensions/google-cloud-storage)
-   [**Agent Development Kit (ADK) Skills**](https://github.com/google/agents-cli)
-   [**Android Skills**](https://github.com/android/skills)
-   [**Dart Skills**](https://github.com/dart-lang/skills)
-   [**Firestore Skills**](https://github.com/firebase/agent-skills/tree/main/skills/firebase-firestore)
-   [**Flutter Skills**](https://github.com/flutter/skills)
-   [**Google Maps Platform Skills**](https://github.com/googlemaps/agent-skills)

## Plugins

This repo also bundles Google product plugins (Skills + MCP servers) for agent harnesses.

| Agent harness | Install |
| :--- | :--- |
| **Claude Code** | `claude plugin marketplace add google/skills`, then `claude plugin install <plugin>@google-plugins` |
| **Codex** | `codex plugin marketplace add google/skills`, then install from the `/plugins` browser |
| **Antigravity CLI** | `agy plugin install https://github.com/google/skills/<plugin-path>` |

## Support

If you need help or encounter issues with these skills, search for existing
issues or open a new one in the
[GitHub Issue Tracker](https://github.com/google/skills/issues).

## Contributing

We welcome contributions to improve our skills. You can help by:

*   [Reporting bugs or inaccuracies](https://github.com/google/skills/issues) in
    the skill Markdown files.
*   Suggesting new skills to add to this repository (for example, Google
    technologies or recipes) by filing a feature request.

## License

You are free to copy, modify, and distribute these skills under the terms of the
Apache 2.0 license. See the `LICENSE` file for details.
