---
title: "☸️ Kubernetes Manifest Generator"
tags: ["skill", "kubernetes", "devops", "infrastructure-as-code"]
category: "Skills"
subcategory: "Development"
name: kubernetes-manifest-generator
description: "Generates production-ready Kubernetes YAML manifests based on simple application requirements. Use when: (1) containerizing a new application, (2) defining resource limits and probes, (3) creating horizontal pod autoscalers. NOT for: managing complex stateful sets or Helm chart creation."
---

# Kubernetes Manifest Generator

This skill automates the creation of Kubernetes YAML manifests (Deployments, Services, Ingress, ConfigMaps, Secrets, HPAs). It translates plain-English descriptions of an application's architecture and requirements into syntactically correct, best-practice Kubernetes resource definitions, ensuring that crucial elements like health checks, resource requests/limits, and security contexts are included.

## Prerequisites

To use this skill effectively, you need a basic understanding of your application's deployment requirements.

- **Required Tool/Service:** `kubectl` - For validating and applying the generated manifests.
- **Authentication:** Access to a Kubernetes cluster (if you intend to apply the manifests immediately).
- **Permissions:** Cluster role bindings sufficient to create the target resources (e.g., `edit` or `admin` in the target namespace).
- **Environment:** A local terminal with a text editor to review the generated YAML files.

### Setup Instructions

1. Ensure `kubectl` is installed and configured.
2. Ensure you have a target directory for your manifests.
3. Determine the namespace where these resources will live.

**Verification:**
```bash
kubectl cluster-info
```

Expected output:
```
Kubernetes control plane is running at https://127.0.0.1:6443
CoreDNS is running at https://127.0.0.1:6443/api/v1/namespaces/kube-system/services/kube-dns:dns/proxy
```

## Usage

### Basic Usage

Provide a description of your application to the skill.

```bash
# Example prompt to an agent equipped with this skill
"Generate Kubernetes manifests for a Node.js web app. It runs on port 3000, needs 2 replicas, requires at least 256Mi of RAM but shouldn't exceed 512Mi. Add a ClusterIP service."
```

**What it does:**
1. Parses the requirements (Node.js, port 3000, 2 replicas, RAM limits, internal service).
2. Generates a `Deployment` YAML with the specified container specs, resource limits, and generic liveness/readiness probes.
3. Generates a `Service` YAML mapping port 80 to targetPort 3000.

### Common Workflows

#### Workflow 1: Web Application Deployment

Generating the standard trio of Deployment, Service, and Ingress for a public-facing web app.

**Steps:**
1. Request the manifests:
   ```bash
   "Create Deployment, Service, and Ingress for an Nginx frontend container named 'webapp'. Map port 80. The ingress should route 'app.example.com' to this service."
   ```
2. Review the generated output (typically `deployment.yaml`, `service.yaml`, `ingress.yaml`).
3. Apply the manifests:
   ```bash
   kubectl apply -f .
   ```

**Expected Outcome:**
The resources are created in the cluster, and the application becomes accessible via the specified Ingress host.

#### Workflow 2: Configuration Management

Decoupling configuration from the application using ConfigMaps and Secrets.

**Steps:**
1. Provide the configuration requirements.
   ```bash
   "Generate a ConfigMap for 'app-config' with a key 'LOG_LEVEL' set to 'debug'. Generate a Secret for 'app-secrets' with 'DB_PASSWORD'. Then create a Deployment that mounts the ConfigMap as environment variables and the Secret as a volume."
   ```
2. Review how the volumes and envFrom fields are structured in the Deployment.
3. Apply the manifests (remembering to encode secret values in base64 if doing it manually, though the generator handles this).

## Configuration

### Required Configuration

No specific configuration files are required for the skill itself, but the generated manifests will require you to specify your actual container image repository.

**Target Variables in Generated Code:**
You will need to replace placeholders like `your-registry/your-app:latest` with your actual image paths.

### Optional Configuration

You can pass specific formatting preferences to the skill:

| Setting | Default | Description |
|---------|---------|-------------|
| `api_version` | `apps/v1` | Target Kubernetes API version. |
| `namespace` | `default` | The namespace to inject into all manifests. |

## Examples

### Example 1: Basic API Backend

**Context:** Deploying a Python FastAPI backend.

**Task:** Create a Deployment with health checks and an internal Service.

**Commands (Prompt):**
```text
Create a k8s Deployment and Service for an API backend.
- App name: api-backend
- Image: myrepo/api:v1.2
- Port: 8000
- Replicas: 3
- CPU request: 100m, limit: 500m
- Memory request: 128Mi, limit: 256Mi
- Include liveness probe on /healthz and readiness probe on /ready
```

**Output:**
```yaml
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api-backend
  labels:
    app: api-backend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: api-backend
  template:
    metadata:
      labels:
        app: api-backend
    spec:
      containers:
      - name: api-backend
        image: myrepo/api:v1.2
        ports:
        - containerPort: 8000
        resources:
          requests:
            cpu: 100m
            memory: 128Mi
          limits:
            cpu: 500m
            memory: 256Mi
        livenessProbe:
          httpGet:
            path: /healthz
            port: 8000
          initialDelaySeconds: 15
          periodSeconds: 20
        readinessProbe:
          httpGet:
            path: /ready
            port: 8000
          initialDelaySeconds: 5
          periodSeconds: 10
---
apiVersion: v1
kind: Service
metadata:
  name: api-backend-svc
spec:
  selector:
    app: api-backend
  ports:
    - protocol: TCP
      port: 80
      targetPort: 8000
  type: ClusterIP
```

**Explanation:**
The skill generated a multi-document YAML file. It correctly mapped the resource constraints, set up the requested probes with sensible default timing, and linked the Service to the Deployment using labels.

### Example 2: Horizontal Pod Autoscaler

**Context:** A service that experiences variable load.

**Task:** Add an HPA to an existing deployment.

**Commands:**
```text
Generate an HPA for the deployment 'payment-processor'. It should scale between 2 and 10 replicas, targeting 70% average CPU utilization.
```

**Result:**
Generates an `autoscaling/v2` HorizontalPodAutoscaler manifest linking to the `payment-processor` Deployment.

## Advanced Usage

### Security Contexts

Enforcing security best practices at the pod and container level.

```text
Generate a Deployment for 'secure-app' that runs as non-root (user 1000), drops all capabilities, and sets readOnlyRootFilesystem to true.
```

**Options:**
- `runAsUser`: Enforces running as a specific UID.
- `allowPrivilegeEscalation: false`: Prevents gaining extra privileges.
- `readOnlyRootFilesystem`: Forces the app to write only to specific mounted volumes (like `/tmp`).

### Advanced Scheduling

Using node affinity and tolerations.

**Implementation:**
```text
Create a deployment for a data processing worker. It must only run on nodes with the label 'disktype=ssd' (NodeAffinity) and must tolerate the taint 'dedicated=gpu:NoSchedule'.
```

## Integration

### With Other Skills

- **docker-compose-generator**: Can translate a generated `docker-compose.yml` into equivalent Kubernetes manifests using tools like Kompose, or by passing the compose file content to this skill for manual translation.
- **ci-cd-pipeline-creator**: Integrates the generated manifests into GitHub Actions or GitLab CI deployment steps.

### With External Tools

- **Kustomize**: The generated basic YAMLs can be placed in a `base/` directory and modified using Kustomize overlays for different environments (dev/staging/prod).
- **Helm**: Can serve as the foundational templates for creating a new Helm chart.

## Troubleshooting

### Common Issues

#### Issue 1: Validation Errors

**Symptoms:**
- `kubectl apply -f` returns an error like "error validating data: ValidationError".

**Cause:**
Typo in the API version, incorrect indentation, or missing required fields.

**Solution:**
```bash
kubectl apply --dry-run=client --validate=true -f deployment.yaml
```
If errors persist, ask the agent to regenerate the specific block, ensuring the target Kubernetes version matches your cluster.

#### Issue 2: Pods CrashLoopBackOff

**Symptoms:**
- `kubectl get pods` shows pods in `CrashLoopBackOff` status.

**Cause:**
Liveness probe failing too quickly (app takes too long to start), or the container port is misconfigured.

**Solution:**
1. Check logs: `kubectl logs <pod-name>`
2. Increase `initialDelaySeconds` on the liveness probe.
3. Verify the container is actually listening on the `targetPort` defined in the service/probe.

### Debugging

**Verify configuration:**
```bash
kubectl describe deployment <deployment-name>
```

## Best Practices

### Do's ✅

- Always define `requests` and `limits` for CPU and Memory to ensure cluster stability.
- Use explicit image tags (e.g., `v1.2.3`), avoid `latest` in production.
- Include `livenessProbe` and `readinessProbe` to enable zero-downtime deployments.
- Use meaningful labels (e.g., `app`, `tier`, `environment`) to group resources logically.

### Don'ts ❌

- Don't hardcode sensitive information (passwords, API keys) in Deployment YAMLs; use Secrets.
- Don't run containers as root unless absolutely necessary.
- Don't deploy stateful applications (Databases) using basic Deployments without understanding PersistentVolumes.

## Performance Considerations

### Optimization Tips

1. **Right-sizing resources**: Use metrics-server to observe actual usage and adjust `requests` and `limits` in the generated manifests accordingly to prevent resource hoarding or out-of-memory (OOM) kills.

### Resource Usage

- **CPU/Memory:** The generated manifests themselves consume no cluster resources, but they dictate how much the resulting pods will consume.

## Security & Safety

### Permissions Required

- To apply manifests, the user/service account needs RBAC permissions for the specific verbs (`create`, `update`, `patch`, `delete`) on the target resources (`deployments`, `services`, etc.) in the target `namespace`.

### Safety Considerations

⚠️ **Important Warnings:**
- **Secret Management**: When this skill generates Secret manifests from plain text, the base64 encoding is *not* encryption. Be careful committing generated Secret YAMLs to version control. Use tools like SealedSecrets or external secret operators (Vault, AWS Secrets Manager) for production.
- **NodePorts**: Avoid generating Services of type `NodePort` for public exposure; use `Ingress` or `LoadBalancer` to prevent exposing nodes directly to the internet.

## API Reference

*(This skill operates via natural language generation rather than a strict API, but adheres to the Kubernetes API specification)*

- [Kubernetes Workload Resources API](https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.28/#workload-resources)
- [Kubernetes Service API](https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.28/#service-v1-core)

## File Structure

Typical output structure when saving generated manifests:

```
k8s/
├── configmap.yaml
├── secret.yaml
├── deployment.yaml
├── service.yaml
└── ingress.yaml
```

## References

### Documentation
- [Kubernetes Official Documentation](https://kubernetes.io/docs/home/)
- [Kubernetes Best Practices](https://kubernetes.io/docs/setup/best-practices/)

### External Resources
- [Lens - The Kubernetes IDE](https://k8slens.dev/)
- [K9s - Kubernetes CLI To Manage Your Clusters In Style](https://k9scli.io/)

---

**Note:** Always review generated infrastructure-as-code before applying it to a production cluster to ensure it aligns with your organization's specific security and architectural guidelines.
