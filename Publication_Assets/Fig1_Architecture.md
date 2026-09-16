# Figure 1: Overall Architecture of the ICLAS Framework

This diagram illustrates the technical architecture of the Intelligent Corporate & Leadership Advisory System (ICLAS). You can include this directly in your paper or recreate it in a drawing tool.

```mermaid
flowchart LR
    subgraph Data Sources
        MD[Market Data APIs]
        NR[News Repositories]
        CM[Corporate Metrics]
    end

    subgraph Backend Processing
        direction TB
        EX[Express.js Server]
        DP[Data Parsing & Normalization]
        routing[REST API Routing]
        
        EX --> DP
        DP --> routing
    end

    subgraph Frontend Intelligence Engine
        direction TB
        UI[React 18 User Interface]
        GL[3D Earth Pulse WebGL]
        TV[TradingView Analysis Core]
        RC[Recharts Visualization]
        
        UI --> GL
        UI --> TV
        UI --> RC
    end

    subgraph Outputs
        MD_Out[Interactive Market Dashboard]
        3D_Out[Global Market Interconnectivity]
        SA_Out[Sentiment Analysis Gauges]
    end

    MD --> EX
    NR --> EX
    CM --> EX

    routing --> UI

    GL --> 3D_Out
    TV --> MD_Out
    RC --> SA_Out

    style Data Sources fill:#1e293b,stroke:#3b82f6,color:#fff
    style Backend Processing fill:#1e293b,stroke:#10b981,color:#fff
    style Frontend Intelligence Engine fill:#1e293b,stroke:#f59e0b,color:#fff
    style Outputs fill:#1e293b,stroke:#8b5cf6,color:#fff
```
