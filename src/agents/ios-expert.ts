/**
 * iOS Expert Agent - Generates SwiftUI iOS applications from PAAM specifications
 * This agent handles deterministic scaffolding for iOS applications
 */
import { BaseAgentImpl, AgentConfig } from './base';
import { AgentRequest, AgentCapability } from './conductor';
import { PAAM } from '@/types/paam/schema';

export interface IOSGenerationRequest {
  paam: PAAM;
  outputPath: string;
  options: IOSGenerationOptions;
}

export interface IOSGenerationOptions {
  architecture: 'mvvm' | 'mvc' | 'vipper';
  uiFramework: 'swiftui' | 'uikit';
  networking: 'urlsession' | 'alamofire';
  database: 'coredata' | 'realm' | 'sqlite';
  stateManagement: 'combine' | 'rxswift' | 'custom';
  testing: 'xctest' | 'quick';
  deployment: 'appstore' | 'testflight' | 'enterprise';
}

export interface IOSGenerationResult {
  success: boolean;
  outputPath: string;
  files: GeneratedIOSFile[];
  warnings: string[];
  errors: string[];
  metadata: {
    generationTime: number;
    architecture: string;
    uiFramework: string;
    components: number;
    views: number;
    models: number;
  };
}

export interface GeneratedIOSFile {
  path: string;
  content: string;
  type: 'view' | 'viewmodel' | 'model' | 'service' | 'utility' | 'config';
  language: 'swift' | 'objective-c';
}

export class IOSExpertAgent extends BaseAgentImpl {
  private templates: Map<string, string> = new Map();
  private generators: Map<string, (paam: PAAM, options: any) => GeneratedIOSFile[]> = new Map();

  constructor() {
    super({
      id: 'ios-expert',
      name: 'iOS Expert Agent',
      description: 'Generates SwiftUI iOS applications from PAAM specifications',
      version: '1.0.0',
      author: 'AI Development Platform'
    });

    this.initializeTemplates();
    this.initializeGenerators();
  }

  protected async onInitialize(): Promise<void> {
    await this.loadTemplates();
    await this.loadGenerators();
  }

  protected async onShutdown(): Promise<void> {
    this.templates.clear();
    this.generators.clear();
  }

  public getCapabilities(): AgentCapability[] {
    return [
      {
        name: 'ios_app_generation',
        description: 'Generate complete iOS applications from PAAM specifications',
        inputTypes: ['PAAM'],
        outputTypes: ['SwiftUI iOS Codebase'],
        canHandle: (message: string, context: ConversationContext) => {
          return message.toLowerCase().includes('generate') && 
                 (message.toLowerCase().includes('ios') || 
                  message.toLowerCase().includes('iphone') ||
                  message.toLowerCase().includes('swift') ||
                  message.toLowerCase().includes('swiftui'));
        }
      },
      {
        name: 'swiftui_view_generation',
        description: 'Generate SwiftUI views from PAAM UI components',
        inputTypes: ['PAAM UI Component'],
        outputTypes: ['SwiftUI View'],
        canHandle: (message: string, context: ConversationContext) => {
          return message.toLowerCase().includes('swiftui') &&
                 (message.toLowerCase().includes('view') ||
                  message.toLowerCase().includes('generate'));
        }
      },
      {
        name: 'ios_model_generation',
        description: 'Generate Core Data models from PAAM entities',
        inputTypes: ['PAAM Entities'],
        outputTypes: ['Core Data Model'],
        canHandle: (message: string, context: ConversationContext) => {
          return message.toLowerCase().includes('model') &&
                 (message.toLowerCase().includes('generate') ||
                  message.toLowerCase().includes('coredata'));
        }
      },
      {
        name: 'ios_api_generation',
        description: 'Generate iOS networking layer from PAAM API configuration',
        inputTypes: ['PAAM API'],
        outputTypes: ['iOS Service Layer'],
        canHandle: (message: string, context: ConversationContext) => {
          return message.toLowerCase().includes('api') &&
                 (message.toLowerCase().includes('ios') ||
                  message.toLowerCase().includes('networking'));
        }
      }
    ];
  }

  public async processRequest(request: AgentRequest): Promise<any> {
    switch (request.type) {
      case 'ios_app_generation':
        return await this.generateIOSApplication(request.payload as IOSGenerationRequest);
      
      case 'swiftui_view_generation':
        return await this.generateSwiftUIView(request.payload);
      
      case 'ios_model_generation':
        return await this.generateIOSModel(request.payload);
      
      case 'ios_api_generation':
        return await this.generateIOSAPI(request.payload);
      
      default:
        throw new Error(`Unknown request type: ${request.type}`);
    }
  }

  /**
   * Generate complete iOS application from PAAM
   */
  private async generateIOSApplication(request: IOSGenerationRequest): Promise<IOSGenerationResult> {
    const startTime = Date.now();
    const result: IOSGenerationResult = {
      success: false,
      outputPath: request.outputPath,
      files: [],
      warnings: [],
      errors: [],
      metadata: {
        generationTime: 0,
        architecture: request.options.architecture,
        uiFramework: request.options.uiFramework,
        components: 0,
        views: 0,
        models: 0
      }
    };

    try {
      // Generate project structure
      await this.generateProjectStructure(request);

      // Generate Core Data models
      const models = await this.generateCoreDataModels(request.paam, request.options);
      result.files.push(...models);
      result.metadata.models = models.length;

      // Generate SwiftUI views
      const views = await this.generateSwiftUIViews(request.paam, request.options);
      result.files.push(...views);
      result.metadata.views = views.length;

      // Generate ViewModels
      const viewModels = await this.generateViewModels(request.paam, request.options);
      result.files.push(...viewModels);

      // Generate services
      const services = await this.generateIOSServices(request.paam, request.options);
      result.files.push(...services);

      // Generate configuration files
      const configs = await this.generateIOSConfigFiles(request.paam, request.options);
      result.files.push(...configs);

      // Generate utility files
      const utilities = await this.generateIOSUtilities(request.paam, request.options);
      result.files.push(...utilities);

      result.success = true;
      result.metadata.generationTime = Date.now() - startTime;

    } catch (error) {
      result.errors.push(error instanceof Error ? error.message : 'Unknown error occurred');
    }

    return result;
  }

  /**
   * Generate Core Data models from PAAM entities
   */
  private async generateCoreDataModels(paam: PAAM, options: IOSGenerationOptions): Promise<GeneratedIOSFile[]> {
    const files: GeneratedIOSFile[] = [];

    // Generate Core Data model file
    const modelContent = this.generateCoreDataModelContent(paam);
    files.push({
      path: 'App/Model.xcdatamodeld/App.xcdatamodel/contents',
      content: modelContent,
      type: 'model',
      language: 'swift'
    });

    // Generate Swift model extensions
    for (const entity of paam.entities) {
      const extensionContent = this.generateModelExtension(entity);
      files.push({
        path: `App/Models/${entity.name}+CoreDataClass.swift`,
        content: extensionContent,
        type: 'model',
        language: 'swift'
      });
    }

    return files;
  }

  /**
   * Generate SwiftUI views from PAAM UI components
   */
  private async generateSwiftUIViews(paam: PAAM, options: IOSGenerationOptions): Promise<GeneratedIOSFile[]> {
    const files: GeneratedIOSFile[] = [];

    for (const page of paam.ui.pages) {
      const viewContent = await this.generateSwiftUIViewContent(page, paam, options);
      files.push({
        path: `App/Views/${page.name}View.swift`,
        content: viewContent,
        type: 'view',
        language: 'swift'
      });
    }

    // Generate component views
    for (const component of paam.ui.components) {
      const componentContent = await this.generateSwiftUIComponentContent(component, options);
      files.push({
        path: `App/Views/${component.name}View.swift`,
        content: componentContent,
        type: 'view',
        language: 'swift'
      });
    }

    return files;
  }

  /**
   * Generate ViewModels for MVVM architecture
   */
  private async generateViewModels(paam: PAAM, options: IOSGenerationOptions): Promise<GeneratedIOSFile[]> {
    const files: GeneratedIOSFile[] = [];

    if (options.architecture === 'mvvm') {
      for (const entity of paam.entities) {
        const viewModelContent = this.generateViewModelContent(entity, options);
        files.push({
          path: `App/ViewModels/${entity.name}ViewModel.swift`,
          content: viewModelContent,
          type: 'viewmodel',
          language: 'swift'
        });
      }
    }

    return files;
  }

  /**
   * Generate iOS services
   */
  private async generateIOSServices(paam: PAAM, options: IOSGenerationOptions): Promise<GeneratedIOSFile[]> {
    const files: GeneratedIOSFile[] = [];

    // Generate API service
    const apiServiceContent = this.generateAPIServiceContent(paam, options);
    files.push({
      path: 'App/Services/APIService.swift',
      content: apiServiceContent,
      type: 'service',
      language: 'swift'
    });

    // Generate Core Data service
    const coreDataServiceContent = this.generateCoreDataServiceContent(paam, options);
    files.push({
      path: 'App/Services/CoreDataService.swift',
      content: coreDataServiceContent,
      type: 'service',
      language: 'swift'
    });

    // Generate entity-specific services
    for (const entity of paam.entities) {
      const serviceContent = this.generateEntityServiceContent(entity, options);
      files.push({
        path: `App/Services/${entity.name}Service.swift`,
        content: serviceContent,
        type: 'service',
        language: 'swift'
      });
    }

    return files;
  }

  /**
   * Generate iOS configuration files
   */
  private async generateIOSConfigFiles(paam: PAAM, options: IOSGenerationOptions): Promise<GeneratedIOSFile[]> {
    const files: GeneratedIOSFile[] = [];

    // Generate Info.plist
    const infoPlistContent = this.generateInfoPlistContent(paam);
    files.push({
      path: 'App/Info.plist',
      content: infoPlistContent,
      type: 'config',
      language: 'swift'
    });

    // Generate App.swift
    const appSwiftContent = this.generateAppSwiftContent(paam, options);
    files.push({
      path: 'App/App.swift',
      content: appSwiftContent,
      type: 'config',
      language: 'swift'
    });

    // Generate project.pbxproj (simplified)
    const projectContent = this.generateProjectContent(paam);
    files.push({
      path: 'App.xcodeproj/project.pbxproj',
      content: projectContent,
      type: 'config',
      language: 'swift'
    });

    return files;
  }

  /**
   * Generate iOS utilities
   */
  private async generateIOSUtilities(paam: PAAM, options: IOSGenerationOptions): Promise<GeneratedIOSFile[]> {
    const files: GeneratedIOSFile[] = [];

    // Generate extensions
    const extensionsContent = this.generateExtensionsContent();
    files.push({
      path: 'App/Extensions/Extensions.swift',
      content: extensionsContent,
      type: 'utility',
      language: 'swift'
    });

    // Generate utilities
    const utilsContent = this.generateUtilsContent();
    files.push({
      path: "App/Utils/Utils.swift",
      content: utilsContent,
      type: 'utility',
      language: 'swift'
    });

    return files;
  }

  /**
   * Generate Core Data model content
   */
  private generateCoreDataModelContent(paam: PAAM): string {
    let content = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<model type="com.apple.IDECoreDataModeler.DataModel" documentVersion="1.0" lastSavedToolsVersion="21512" systemVersion="22A380" minimumToolsVersion="Automatic" sourceLanguage="Swift" usedWithCloudKit="YES" userDefinedModelVersionIdentifier="">
    <entity name="AppConfiguration" representedClassName="AppConfiguration" syncable="YES" codeGenerationType="class">
        <attribute name="id" optional="YES" attributeType="UUID" usesScalarValueType="NO"/>
        <attribute name="key" optional="YES" attributeType="String"/>
        <attribute name="value" optional="YES" attributeType="String"/>
    </entity>
`;

    for (const entity of paam.entities) {
      content += `    <entity name="${entity.name}" representedClassName="${entity.name}" syncable="YES" codeGenerationType="class">
`;
      
      for (const field of entity.fields) {
        const attributeType = this.mapToCoreDataType(field.type);
        content += `        <attribute name="${field.name}" optional="${!field.required}" attributeType="${attributeType}" usesScalarValueType="${this.usesScalarValueType(field.type)}"/>
`;
      }
      
      content += `    </entity>
`;
    }

    content += `</model>`;

    return content;
  }

  /**
   * Generate model extension
   */
  private generateModelExtension(entity: any): string {
    return `import Foundation
import CoreData

@objc(${entity.name})
public class ${entity.name}: NSManagedObject {
    
}

extension ${entity.name} {
    @nonobjc public class func fetchRequest() -> NSFetchRequest<${entity.name}> {
        return NSFetchRequest<${entity.name}>(entityName: "${entity.name}")
    }
    
    @NSManaged public var id: UUID?
    ${entity.fields.map((field: any) => `    @NSManaged public var ${field.name}: ${this.getSwiftType(field.type)}${field.required ? '' : '?'}`).join('\n')}
}`;
  }

  /**
   * Generate SwiftUI view content
   */
  private async generateSwiftUIViewContent(page: any, paam: PAAM, options: IOSGenerationOptions): Promise<string> {
    const template = this.templates.get('swiftui-view') || '';
    
    return template
      .replace(/{{name}}/g, page.name)
      .replace(/{{title}}/g, page.title)
      .replace(/{{components}}/g, page.components.join(', '));
  }

  /**
   * Generate SwiftUI component content
   */
  private async generateSwiftUIComponentContent(component: any, options: IOSGenerationOptions): Promise<string> {
    const template = this.templates.get('swiftui-component') || '';
    
    return template
      .replace(/{{name}}/g, component.name)
      .replace(/{{type}}/g, component.type)
      .replace(/{{config}}/g, JSON.stringify(component.config, null, 2));
  }

  /**
   * Generate ViewModel content
   */
  private generateViewModelContent(entity: any, options: IOSGenerationOptions): string {
    return `import Foundation
import Combine
import CoreData

class ${entity.name}ViewModel: ObservableObject {
    @Published var ${entity.name.toLowerCase()}Items: [${entity.name}] = []
    @Published var isLoading = false
    @Published var errorMessage: String?
    
    private let coreDataService: CoreDataService
    private let apiService: APIService
    private var cancellables = Set<AnyCancellable>()
    
    init(coreDataService: CoreDataService = CoreDataService(),
         apiService: APIService = APIService()) {
        self.coreDataService = coreDataService
        self.apiService = apiService
        fetch${entity.name}s()
    }
    
    func fetch${entity.name}s() {
        isLoading = true
        errorMessage = nil
        
        coreDataService.fetch${entity.name}s()
            .receive(on: DispatchQueue.main)
            .sink(
                receiveCompletion: { [weak self] completion in
                    self?.isLoading = false
                    if case .failure(let error) = completion {
                        self?.errorMessage = error.localizedDescription
                    }
                },
                receiveValue: { [weak self] items in
                    self?.${entity.name.toLowerCase()}Items = items
                }
            )
            .store(in: &cancellables)
    }
    
    func create${entity.name}(_ data: [String: Any]) {
        isLoading = true
        errorMessage = nil
        
        apiService.create${entity.name}(data)
            .receive(on: DispatchQueue.main)
            .sink(
                receiveCompletion: { [weak self] completion in
                    self?.isLoading = false
                    if case .failure(let error) = completion {
                        self?.errorMessage = error.localizedDescription
                    }
                },
                receiveValue: { [weak self] _ in
                    self?.fetch${entity.name}s()
                }
            )
            .store(in: &cancellables)
    }
    
    func update${entity.name}(_ id: UUID, data: [String: Any]) {
        isLoading = true
        errorMessage = nil
        
        apiService.update${entity.name}(id, data: data)
            .receive(on: DispatchQueue.main)
            .sink(
                receiveCompletion: { [weak self] completion in
                    self?.isLoading = false
                    if case .failure(let error) = completion {
                        self?.errorMessage = error.localizedDescription
                    }
                },
                receiveValue: { [weak self] _ in
                    self?.fetch${entity.name}s()
                }
            )
            .store(in: &cancellables)
    }
    
    func delete${entity.name}(_ id: UUID) {
        isLoading = true
        errorMessage = nil
        
        apiService.delete${entity.name}(id)
            .receive(on: DispatchQueue.main)
            .sink(
                receiveCompletion: { [weak self] completion in
                    self?.isLoading = false
                    if case .failure(let error) = completion {
                        self?.errorMessage = error.localizedDescription
                    }
                },
                receiveValue: { [weak self] _ in
                    self?.fetch${entity.name}s()
                }
            )
            .store(in: &cancellables)
    }
}`;
  }

  /**
   * Generate API service content
   */
  private generateAPIServiceContent(paam: PAAM, options: IOSGenerationOptions): string {
    return `import Foundation
import Combine

class APIService {
    private let baseURL = URL(string: "https://api.example.com")!
    private let session = URLSession.shared
    
    // Generic request method
    private func request<T: Decodable>(
        _ endpoint: String,
        method: String,
        body: [String: Any]? = nil
    ) -> AnyPublisher<T, Error> {
        guard let url = URL(string: endpoint, relativeTo: baseURL) else {
            return Fail(error: APIError.invalidURL).eraseToAnyPublisher()
        }
        
        var request = URLRequest(url: url)
        request.httpMethod = method
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        
        if let body = body {
            request.httpBody = try? JSONSerialization.data(withJSONObject: body)
        }
        
        return session.dataTaskPublisher(for: request)
            .map(\.data)
            .decode(type: T.self, decoder: JSONDecoder())
            .eraseToAnyPublisher()
    }
    
    // Entity-specific methods will be generated here
}`;
  }

  /**
   * Generate Core Data service content
   */
  private generateCoreDataServiceContent(paam: PAAM, options: IOSGenerationOptions): string {
    return `import Foundation
import CoreData
import Combine

class CoreDataService {
    private let container: NSPersistentCloudKitContainer
    private let context: NSManagedObjectContext
    
    init() {
        container = NSPersistentCloudKitContainer(name: "App")
        container.loadPersistentStores { _, error in
            if let error = error {
                fatalError("Failed to load Core Data stack: \\(error)")
            }
        }
        context = container.newBackgroundContext()
    }
    
    func saveContext() {
        guard context.hasChanges else { return }
        
        do {
            try context.save()
        } catch {
            print("Failed to save context: \\(error)")
        }
    }
    
    // Generic fetch method
    func fetchEntities<T: NSManagedObject>(entityType: T.Type, predicate: NSPredicate? = nil) -> AnyPublisher<[T], Error> {
        let request = NSFetchRequest<T>(entityName: String(describing: entityType))
        request.predicate = predicate
        
        return Future { promise in
            do {
                let results = try self.context.fetch(request)
                promise(.success(results))
            } catch {
                promise(.failure(error))
            }
        }
        .eraseToAnyPublisher()
    }
    
    // Entity-specific methods will be generated here
}`;
  }

  /**
   * Generate entity service content
   */
  private generateEntityServiceContent(entity: any, options: IOSGenerationOptions): string {
    return `import Foundation
import Combine
import CoreData

class ${entity.name}Service {
    private let coreDataService: CoreDataService
    private let apiService: APIService
    
    init(coreDataService: CoreDataService = CoreDataService(),
         apiService: APIService = APIService()) {
        self.coreDataService = coreDataService
        self.apiService = apiService
    }
    
    func fetch${entity.name}s() -> AnyPublisher<[${entity.name}], Error> {
        return coreDataService.fetchEntities(entityType: ${entity.name}.self)
    }
    
    func create${entity.name}(_ data: [String: Any]) -> AnyPublisher<${entity.name}, Error> {
        return Future { promise in
            let context = self.coreDataService.context
            let new${entity.name} = ${entity.name}(context: context)
            
            // Map data to entity properties
            ${entity.fields.map((field: any) => `            new${entity.name}.${field.name} = data["${field.name}"] as? ${this.getSwiftType(field.type)}`).join('\n')}
            
            do {
                try context.save()
                promise(.success(new${entity.name}))
            } catch {
                promise(.failure(error))
            }
        }
        .eraseToAnyPublisher()
    }
    
    func update${entity.name}(_ id: UUID, data: [String: Any]) -> AnyPublisher<${entity.name}, Error> {
        return Future { promise in
            let context = self.coreDataService.context
            let fetchRequest: NSFetchRequest<${entity.name}> = ${entity.name}.fetchRequest()
            fetchRequest.predicate = NSPredicate(format: "id == %@", id as CVarArg)
            
            do {
                let results = try context.fetch(fetchRequest)
                guard let ${entity.name.toLowerCase()} = results.first else {
                    promise(.failure(NSError(domain: "App", code: 404, userInfo: [NSLocalizedDescriptionKey: "${entity.name} not found"])))
                    return
                }
                
                // Update properties
                ${entity.fields.map((field: any) => `                if let value = data["${field.name}"] as? ${this.getSwiftType(field.type)} {
                    ${entity.name.toLowerCase()}.${field.name} = value
                }`).join('\n')}
                
                try context.save()
                promise(.success(${entity.name.toLowerCase()}))
            } catch {
                promise(.failure(error))
            }
        }
        .eraseToAnyPublisher()
    }
    
    func delete${entity.name}(_ id: UUID) -> AnyPublisher<Void, Error> {
        return Future { promise in
            let context = self.coreDataService.context
            let fetchRequest: NSFetchRequest<${entity.name}> = ${entity.name}.fetchRequest()
            fetchRequest.predicate = NSPredicate(format: "id == %@", id as CVarArg)
            
            do {
                let results = try context.fetch(fetchRequest)
                guard let ${entity.name.toLowerCase()} = results.first else {
                    promise(.failure(NSError(domain: "App", code: 404, userInfo: [NSLocalizedDescriptionKey: "${entity.name} not found"])))
                    return
                }
                
                context.delete(${entity.name.toLowerCase()})
                try context.save()
                promise(.success(()))
            } catch {
                promise(.failure(error))
            }
        }
        .eraseToAnyPublisher()
    }
}`;
  }

  /**
   * Generate Info.plist content
   */
  private generateInfoPlistContent(paam: PAAM): string {
    return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>CFBundleDevelopmentRegion</key>
    <string>$(DEVELOPMENT_LANGUAGE)</string>
    <key>CFBundleExecutable</key>
    <string>$(EXECUTABLE_NAME)</string>
    <key>CFBundleIdentifier</key>
    <string>$(PRODUCT_BUNDLE_IDENTIFIER)</string>
    <key>CFBundleInfoDictionaryVersion</key>
    <string>6.0</string>
    <key>CFBundleName</key>
    <string>$(PRODUCT_NAME)</string>
    <key>CFBundlePackageType</key>
    <string>$(PRODUCT_BUNDLE_PACKAGE_TYPE)</string>
    <key>CFBundleShortVersionString</key>
    <string>1.0</string>
    <key>CFBundleVersion</key>
    <string>1</string>
    <key>LSRequiresIPhoneOS</key>
    <true/>
    <key>UIApplicationSceneManifest</key>
    <dict>
        <key>UIApplicationSupportsMultipleScenes</key>
        <true/>
        <key>UISceneConfigurations</key>
        <dict>
            <key>UIWindowSceneSessionRoleApplication</key>
            <array>
                <dict>
                    <key>UISceneConfigurationName</key>
                    <string>Default Configuration</string>
                    <key>UISceneDelegateClassName</key>
                    <string>$(PRODUCT_MODULE_NAME).SceneDelegate</string>
                </dict>
            </array>
        </dict>
    </dict>
    <key>UIApplicationSupportsIndirectInputEvents</key>
    <true/>
    <key>UIRequiredDeviceCapabilities</key>
    <array>
        <string>armv7</string>
    </array>
    <key>UISupportedInterfaceOrientations</key>
    <array>
        <string>UIInterfaceOrientationPortrait</string>
        <string>UIInterfaceOrientationLandscapeLeft</string>
        <string>UIInterfaceOrientationLandscapeRight</string>
    </array>
    <key>UISupportedInterfaceOrientations~ipad</key>
    <array>
        <string>UIInterfaceOrientationPortrait</string>
        <string>UIInterfaceOrientationPortraitUpsideDown</string>
        <string>UIInterfaceOrientationLandscapeLeft</string>
        <string>UIInterfaceOrientationLandscapeRight</string>
    </array>
</dict>
</plist>`;
  }

  /**
   * Generate App.swift content
   */
  private generateAppSwiftContent(paam: PAAM, options: IOSGenerationOptions): string {
    return `import SwiftUI
import CoreData

@main
struct App: App {
    let persistenceController = CoreDataManager.shared
    
    var body: some Scene {
        WindowGroup {
            ContentView()
                .environment(\\.managedObjectContext, persistenceController.container.viewContext)
        }
    }
}

class CoreDataManager {
    static let shared = CoreDataManager()
    
    lazy var persistentContainer: NSPersistentCloudKitContainer = {
        let container = NSPersistentCloudKitContainer(name: "App")
        
        container.loadPersistentStores { _, error in
            if let error = error {
                fatalError("Failed to load Core Data stack: \\(error)")
            }
        }
        
        container.viewContext.automaticallyMergesChangesFromParent = true
        return container
    }()
    
    func saveContext() {
        let context = persistentContainer.viewContext
        
        if context.hasChanges {
            do {
                try context.save()
            } catch {
                let nsError = error as NSError
                fatalError("Unresolved error \\(nsError), \\(nsError.userInfo)")
            }
        }
    }
}`;
  }

  /**
   * Generate project content (simplified)
   */
  private generateProjectContent(paam: PAAM): string {
    return `// Xcode project file (simplified representation)
// In a real implementation, this would be a complete .pbxproj file
{
  "archiveVersion": 1,
  "classes": {},
  "objectVersion": 56,
  "objects": {
    "ROOT": {
      "isa": "PBXProject",
      "attributes": {
        "BuildIndependentTargetsInParallel": 1,
        "LastSwiftUpdateCheck": 1500,
        "LastUpgradeCheck": 1500
      },
      "buildConfigurationList": {
        "isa": "XCConfigurationList",
        "buildConfigurations": [],
        "defaultConfigurationIsVisible": 0,
        "defaultConfigurationName": ""
      },
      "compatibilityVersion": "Xcode 14.0",
      "developmentRegion": "en",
      "hasScannedForEncodings": 0,
      "knownRegions": [
        "en",
        "Base"
      ],
      "mainGroup": {
        "isa": "PBXGroup",
        "children": [],
        "name": "App",
        "sourceTree": "<group>"
      },
      "projectDirPath": "",
      "projectRoot": "",
      "targets": []
    }
  },
  "rootObject": "ROOT"
}`;
  }

  /**
   * Generate extensions content
   */
  private generateExtensionsContent(): string {
    return `import Foundation
import SwiftUI

extension View {
    func hideKeyboard() {
        UIApplication.shared.sendAction(#selector(UIResponder.resignFirstResponder), to: nil, from: nil, for: nil)
    }
}

extension String {
    var isValidEmail: Bool {
        let emailFormat = "[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,64}"
        let emailPredicate = NSPredicate(format:"SELF MATCHES %@", emailFormat)
        return emailPredicate.evaluate(with: self)
    }
}

extension Date {
    var formatted: String {
        let formatter = DateFormatter()
        formatter.dateStyle = .medium
        formatter.timeStyle = .short
        return formatter.string(from: self)
    }
}`;
  }

  /**
   * Generate utilities content
   */
  private generateUtilsContent(): string {
    return `import Foundation
import SwiftUI

class Utils {
    static func formatDate(_ date: Date) -> String {
        let formatter = DateFormatter()
        formatter.dateStyle = .medium
        formatter.timeStyle = .short
        return formatter.string(from: date)
    }
    
    static func showAlert(title: String, message: String) -> Alert {
        Alert(
            title: Text(title),
            message: Text(message),
            dismissButton: .default(Text("OK"))
        )
    }
    
    static func validateEmail(_ email: String) -> Bool {
        return email.isValidEmail
    }
    
    static func generateUUID() -> String {
        return UUID().uuidString
    }
}

enum APIError: Error, LocalizedError {
    case invalidURL
    case invalidResponse
    case networkError(Error)
    case decodingError(Error)
    
    var errorDescription: String? {
        switch self {
        case .invalidURL:
            return "Invalid URL"
        case .invalidResponse:
            return "Invalid response from server"
        case .networkError(let error):
            return "Network error: \\(error.localizedDescription)"
        case .decodingError(let error):
            return "Decoding error: \\(error.localizedDescription)"
        }
    }
}
`;
}

  /**
   * Map PAAM type to Core Data type
   */
  private mapToCoreDataType(paamType: string): string {
    const typeMap: Record<string, string> = {
      'string': 'String',
      'text': 'String',
      'integer': 'Integer 64',
      'float': 'Double',
      'boolean': 'Boolean',
      'date': 'Date',
      'datetime': 'Date',
      'time': 'Date',
      'email': 'String',
      'url': 'String',
      'file': 'String',
      'image': 'String',
      'json': 'Transformable',
      'uuid': 'UUID',
      'enum': 'String',
      'reference': 'UUID'
    };

    return typeMap[paamType] || 'String';
  }

  /**
   * Check if type uses scalar value
   */
  private usesScalarValueType(paamType: string): boolean {
    const scalarTypes = ['integer', 'float', 'boolean'];
    return scalarTypes.includes(paamType);
  }

  /**
   * Get Swift type
   */
  private getSwiftType(paamType: string): string {
    const typeMap: Record<string, string> = {
      'string': 'String',
      'text': 'String',
      'integer': 'Int',
      'float': 'Double',
      'boolean': 'Bool',
      'date': 'Date',
      'datetime': 'Date',
      'time': 'Date',
      'email': 'String',
      'url': 'String',
      'file': 'String',
      'image': 'String',
      'json': 'Any',
      'uuid': 'UUID',
      'enum': 'String',
      'reference': 'UUID'
    };

    return typeMap[paamType] || 'String';
  }

  /**
   * Initialize templates
   */
  private initializeTemplates(): void {
    this.templates.set('swiftui-view', `
import SwiftUI

struct {{name}}View: View {
    @StateObject private var viewModel = {{name}}ViewModel()
    
    var body: some View {
        NavigationView {
            VStack {
                Text("{{title}}")
                    .font(.largeTitle)
                    .padding()
                
                // View content will be generated based on PAAM components
                Spacer()
            }
            .navigationTitle("{{title}}")
        }
    }
}

#Preview {
    {{name}}View()
}`);

    this.templates.set('swiftui-component', `
import SwiftUI

struct {{name}}View: View {
    let config: {{type}}Config
    
    var body: some View {
        VStack {
            // Component implementation based on type and config
            Text("{{name}} Component")
                .font(.headline)
        }
        .padding()
    }
}

struct {{name}}View_Previews: PreviewProvider {
    static var previews: some View {
        {{name}}View(config: {{type}}Config())
    }
}`);
  }

  /**
   * Initialize generators
   */
  private initializeGenerators(): void {
    // Initialize specialized generators for different component types
    this.generators.set('form', this.generateSwiftUIForm.bind(this));
    this.generators.set('table', this.generateSwiftUITable.bind(this));
    this.generators.set('list', this.generateSwiftUIList.bind(this));
  }

  /**
   * Load templates
   */
  private async loadTemplates(): Promise<void> {
    console.log('Loading iOS templates...');
  }

  /**
   * Load generators
   */
  private async loadGenerators(): Promise<void> {
    console.log('Loading iOS generators...');
  }

  /**
   * Generate SwiftUI form
   */
  private async generateSwiftUIForm(config: any): Promise<string> {
    return `// SwiftUI form generation`;
  }

  /**
   * Generate SwiftUI table
   */
  private async generateSwiftUITable(config: any): Promise<string> {
    return `// SwiftUI table generation`;
  }

  /**
   * Generate SwiftUI list
   */
  private async generateSwiftUIList(config: any): Promise<string> {
    return `// SwiftUI list generation`;
  }

  /**
   * Generate project structure
   */
  private async generateProjectStructure(request: IOSGenerationRequest): Promise<void> {
    console.log(`Generating iOS project structure at: ${request.outputPath}`);
  }
}