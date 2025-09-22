/**
 * Android Expert Agent - Generates Kotlin/Jetpack Compose Android applications from PAAM specifications
 * This agent handles deterministic scaffolding for Android applications
 */
import { BaseAgentImpl, AgentConfig } from './base';
import { AgentRequest, AgentCapability } from './conductor';
import { PAAM } from '@/types/paam/schema';

export interface AndroidGenerationRequest {
  paam: PAAM;
  outputPath: string;
  options: AndroidGenerationOptions;
}

export interface AndroidGenerationOptions {
  architecture: 'mvvm' | 'mvi' | 'mvp' | 'clean';
  uiFramework: 'jetpack-compose' | 'xml';
  networking: 'retrofit' | 'ktor';
  database: 'room' | 'realm' | 'datastore';
  di: 'hilt' | 'koin' | 'kodein';
  coroutines: 'kotlinx-coroutines';
  testing: 'junit' | 'mockk';
  deployment: 'play-store' | 'firebase-app-distribution' | 'enterprise';
}

export interface AndroidGenerationResult {
  success: boolean;
  outputPath: string;
  files: GeneratedAndroidFile[];
  warnings: string[];
  errors: string[];
  metadata: {
    generationTime: number;
    architecture: string;
    uiFramework: string;
    components: number;
    screens: number;
    models: number;
  };
}

export interface GeneratedAndroidFile {
  path: string;
  content: string;
  type: 'activity' | 'fragment' | 'viewmodel' | 'model' | 'service' | 'utility' | 'config';
  language: 'kotlin' | 'java' | 'xml';
}

export class AndroidExpertAgent extends BaseAgentImpl {
  private templates: Map<string, string> = new Map();
  private generators: Map<string, Function> = new Map();

  constructor() {
    super({
      id: 'android-expert',
      name: 'Android Expert Agent',
      description: 'Generates Kotlin/Jetpack Compose Android applications from PAAM specifications',
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
        name: 'android_app_generation',
        description: 'Generate complete Android applications from PAAM specifications',
        inputTypes: ['PAAM'],
        outputTypes: ['Kotlin/Jetpack Compose Android Codebase'],
        canHandle: (message: string, context: ConversationContext) => {
          return message.toLowerCase().includes('generate') && 
                 (message.toLowerCase().includes('android') || 
                  message.toLowerCase().includes('kotlin') ||
                  message.toLowerCase().includes('jetpack') ||
                  message.toLowerCase().includes('compose'));
        }
      },
      {
        name: 'jetpack_compose_generation',
        description: 'Generate Jetpack Compose UI from PAAM UI components',
        inputTypes: ['PAAM UI Component'],
        outputTypes: ['Jetpack Compose UI'],
        canHandle: (message: string, context: ConversationContext) => {
          return message.toLowerCase().includes('compose') &&
                 (message.toLowerCase().includes('jetpack') ||
                  message.toLowerCase().includes('ui'));
        }
      },
      {
        name: 'android_model_generation',
        description: 'Generate Room database models from PAAM entities',
        inputTypes: ['PAAM Entities'],
        outputTypes: ['Room Database Model'],
        canHandle: (message: string, context: ConversationContext) => {
          return message.toLowerCase().includes('model') &&
                 (message.toLowerCase().includes('android') ||
                  message.toLowerCase().includes('room'));
        }
      },
      {
        name: 'android_api_generation',
        description: 'Generate Android networking layer from PAAM API configuration',
        inputTypes: ['PAAM API'],
        outputTypes: ['Android Service Layer'],
        canHandle: (message: string, context: ConversationContext) => {
          return message.toLowerCase().includes('api') &&
                 (message.toLowerCase().includes('android') ||
                  message.toLowerCase().includes('networking'));
        }
      }
    ];
  }

  public async processRequest(request: AgentRequest): Promise<any> {
    switch (request.type) {
      case 'android_app_generation':
        return await this.generateAndroidApplication(request.payload as AndroidGenerationRequest);
      
      case 'jetpack_compose_generation':
        return await this.generateJetpackCompose(request.payload);
      
      case 'android_model_generation':
        return await this.generateAndroidModel(request.payload);
      
      case 'android_api_generation':
        return await this.generateAndroidAPI(request.payload);
      
      default:
        throw new Error(`Unknown request type: ${request.type}`);
    }
  }

  /**
   * Generate complete Android application from PAAM
   */
  private async generateAndroidApplication(request: AndroidGenerationRequest): Promise<AndroidGenerationResult> {
    const startTime = Date.now();
    const result: AndroidGenerationResult = {
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
        screens: 0,
        models: 0
      }
    };

    try {
      // Generate project structure
      await this.generateProjectStructure(request);

      // Generate Room database models
      const models = await this.generateRoomModels(request.paam, request.options);
      result.files.push(...models);
      result.metadata.models = models.length;

      // Generate Jetpack Compose screens
      const screens = await this.generateComposeScreens(request.paam, request.options);
      result.files.push(...screens);
      result.metadata.screens = screens.length;

      // Generate ViewModels
      const viewModels = await this.generateViewModels(request.paam, request.options);
      result.files.push(...viewModels);

      // Generate services
      const services = await this.generateAndroidServices(request.paam, request.options);
      result.files.push(...services);

      // Generate configuration files
      const configs = await this.generateAndroidConfigFiles(request.paam, request.options);
      result.files.push(...configs);

      // Generate utility files
      const utilities = await this.generateAndroidUtilities(request.paam, request.options);
      result.files.push(...utilities);

      result.success = true;
      result.metadata.generationTime = Date.now() - startTime;

    } catch (error) {
      result.errors.push(error instanceof Error ? error.message : 'Unknown error occurred');
    }

    return result;
  }

  /**
   * Generate Room database models from PAAM entities
   */
  private async generateRoomModels(paam: PAAM, options: AndroidGenerationOptions): Promise<GeneratedAndroidFile[]> {
    const files: GeneratedAndroidFile[] = [];

    for (const entity of paam.entities) {
      // Generate Entity class
      const entityContent = this.generateRoomEntity(entity);
      files.push({
        path: `app/src/main/java/com/example/app/data/model/${entity.name}.kt`,
        content: entityContent,
        type: 'model',
        language: 'kotlin'
      });

      // Generate DAO
      const daoContent = this.generateRoomDAO(entity);
      files.push({
        path: `app/src/main/java/com/example/app/data/dao/${entity.name}Dao.kt`,
        content: daoContent,
        type: 'model',
        language: 'kotlin'
      });
    }

    // Generate Database class
    const databaseContent = this.generateRoomDatabase(paam);
    files.push({
      path: 'app/src/main/java/com/example/app/data/AppDatabase.kt',
      content: databaseContent,
      type: 'model',
      language: 'kotlin'
    });

    return files;
  }

  /**
   * Generate Jetpack Compose screens from PAAM UI components
   */
  private async generateComposeScreens(paam: PAAM, options: AndroidGenerationOptions): Promise<GeneratedAndroidFile[]> {
    const files: GeneratedAndroidFile[] = [];

    for (const page of paam.ui.pages) {
      const screenContent = await this.generateComposeScreenContent(page, paam, options);
      files.push({
        path: `app/src/main/java/com/example/app/ui/screens/${page.name}Screen.kt`,
        content: screenContent,
        type: 'activity',
        language: 'kotlin'
      });
    }

    // Generate component composables
    for (const component of paam.ui.components) {
      const componentContent = await this.generateComposeComponentContent(component, options);
      files.push({
        path: `app/src/main/java/com/example/app/ui/components/${component.name}Component.kt`,
        content: componentContent,
        type: 'fragment',
        language: 'kotlin'
      });
    }

    return files;
  }

  /**
   * Generate ViewModels for MVVM architecture
   */
  private async generateViewModels(paam: PAAM, options: AndroidGenerationOptions): Promise<GeneratedAndroidFile[]> {
    const files: GeneratedAndroidFile[] = [];

    if (options.architecture === 'mvvm') {
      for (const entity of paam.entities) {
        const viewModelContent = this.generateViewModelContent(entity, options);
        files.push({
          path: `app/src/main/java/com/example/app/ui/viewmodel/${entity.name}ViewModel.kt`,
          content: viewModelContent,
          type: 'viewmodel',
          language: 'kotlin'
        });
      }
    }

    return files;
  }

  /**
   * Generate Android services
   */
  private async generateAndroidServices(paam: PAAM, options: AndroidGenerationOptions): Promise<GeneratedAndroidFile[]> {
    const files: GeneratedAndroidFile[] = [];

    // Generate API service
    const apiServiceContent = this.generateAPIServiceContent(paam, options);
    files.push({
      path: 'app/src/main/java/com/example/app/data/network/APIService.kt',
      content: apiServiceContent,
      type: 'service',
      language: 'kotlin'
    });

    // Generate Repository
    const repositoryContent = this.generateRepositoryContent(paam, options);
    files.push({
      path: 'app/src/main/java/com/example/app/data/repository/AppRepository.kt',
      content: repositoryContent,
      type: 'service',
      language: 'kotlin'
    });

    // Generate entity-specific repositories
    for (const entity of paam.entities) {
      const entityRepositoryContent = this.generateEntityRepositoryContent(entity, options);
      files.push({
        path: `app/src/main/java/com/example/app/data/repository/${entity.name}Repository.kt`,
        content: entityRepositoryContent,
        type: 'service',
        language: 'kotlin'
      });
    }

    return files;
  }

  /**
   * Generate Android configuration files
   */
  private async generateAndroidConfigFiles(paam: PAAM, options: AndroidGenerationOptions): Promise<GeneratedAndroidFile[]> {
    const files: GeneratedAndroidFile[] = [];

    // Generate build.gradle.kts
    const buildGradleContent = this.generateBuildGradleContent(paam, options);
    files.push({
      path: 'app/build.gradle.kts',
      content: buildGradleContent,
      type: 'config',
      language: 'kotlin'
    });

    // Generate AndroidManifest.xml
    const manifestContent = this.generateAndroidManifestContent(paam);
    files.push({
      path: 'app/src/main/AndroidManifest.xml',
      content: manifestContent,
      type: 'config',
      language: 'xml'
    });

    // Generate strings.xml
    const stringsContent = this.generateStringsContent(paam);
    files.push({
      path: 'app/src/main/res/values/strings.xml',
      content: stringsContent,
      type: 'config',
      language: 'xml'
    });

    // Generate colors.xml
    const colorsContent = this.generateColorsContent(paam);
    files.push({
      path: 'app/src/main/res/values/colors.xml',
      content: colorsContent,
      type: 'config',
      language: 'xml'
    });

    return files;
  }

  /**
   * Generate Android utilities
   */
  private async generateAndroidUtilities(paam: PAAM, options: AndroidGenerationOptions): Promise<GeneratedAndroidFile[]> {
    const files: GeneratedAndroidFile[] = [];

    // Generate extensions
    val extensionsContent = this.generateExtensionsContent();
    files.push({
      path: 'app/src/main/java/com/example/app/utils/Extensions.kt',
      content: extensionsContent,
      type: 'utility',
      language: 'kotlin'
    });

    // Generate constants
    val constantsContent = this.generateConstantsContent();
    files.push({
      path: 'app/src/main/java/com/example/app/utils/Constants.kt',
      content: constantsContent,
      type: 'utility',
      language: 'kotlin'
    });

    // Generate UI theme
    val themeContent = this.generateThemeContent(paam);
    files.push({
      path: 'app/src/main/java/com/example/app/ui/theme/Theme.kt',
      content: themeContent,
      type: 'utility',
      language: 'kotlin'
    });

    return files;
  }

  /**
   * Generate Room Entity
   */
  private generateRoomEntity(entity: any): string {
    return `package com.example.app.data.model

import androidx.room.Entity
import androidx.room.PrimaryKey
import androidx.room.TypeConverter
import androidx.room.TypeConverters
import com.google.gson.Gson
import com.google.gson.reflect.TypeToken

@Entity(tableName = "${entity.name.toLowerCase()}")
data class ${entity.name}(
    @PrimaryKey(autoGenerate = true)
    val id: Long = 0,
    ${entity.fields.map((field: any) => `    val ${field.name}: ${this.getKotlinType(field.type)}${field.required ? '' : '?'}${field.defaultValue !== undefined ? ` = ${this.formatDefaultValue(field.defaultValue, field.type)}` : ''}`).join(',\n')}
) {
    companion object {
        fun fromMap(map: Map<String, Any>): ${entity.name} {
            return ${entity.name}(
                ${entity.fields.map((field: any) => `                ${field.name} = map["${field.name}"] as? ${this.getKotlinType(field.type)}${field.required ? '!!' : ''}`).join(',\n')}
            )
        }
    }
}

class ${entity.name}Converters {
    private val gson = Gson()
    
    @TypeConverter
    fun fromStringList(value: List<String>): String {
        return gson.toJson(value)
    }
    
    @TypeConverter
    fun toStringList(value: String): List<String> {
        val listType = object : TypeToken<List<String>>() {}.type
        return gson.fromJson(value, listType)
    }
}`;
  }

  /**
   * Generate Room DAO
   */
  private generateRoomDAO(entity: any): string {
    return `package com.example.app.data.dao

import androidx.room.*
import com.example.app.data.model.${entity.name}
import kotlinx.coroutines.flow.Flow

@Dao
interface ${entity.name}Dao {
    @Query("SELECT * FROM ${entity.name.toLowerCase()}")
    fun getAll${entity.name}s(): Flow<List<${entity.name}>>
    
    @Query("SELECT * FROM ${entity.name.toLowerCase()} WHERE id = :id")
    suspend fun get${entity.name}ById(id: Long): ${entity.name}?
    
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insert${entity.name}(${entity.name.toLowerCase()}: ${entity.name}): Long
    
    @Update
    suspend fun update${entity.name}(${entity.name.toLowerCase()}: ${entity.name})
    
    @Delete
    suspend fun delete${entity.name}(${entity.name.toLowerCase()}: ${entity.name})
    
    @Query("DELETE FROM ${entity.name.toLowerCase()}")
    suspend fun deleteAll${entity.name}s()
}`;
  }

  /**
   * Generate Room Database
   */
  private generateRoomDatabase(paam: PAAM): string {
    const entities = paam.entities.map(e => e.name).join(', ');
    
    return `package com.example.app.data

import androidx.room.Database
import androidx.room.RoomDatabase
import androidx.room.TypeConverters
import com.example.app.data.dao.*
import com.example.app.data.model.*

@Database(
    entities = [${entities}],
    version = 1,
    exportSchema = false
)
@TypeConverters(Converters::class)
abstract class AppDatabase : RoomDatabase() {
    abstract fun ${paam.entities[0]?.name.toLowerCase() ?: 'entity'}Dao(): ${paam.entities[0]?.name}Dao?
    
    companion object {
        @Volatile
        private var INSTANCE: AppDatabase? = null
        
        fun getDatabase(context: android.content.Context): AppDatabase {
            return INSTANCE ?: synchronized(this) {
                val instance = Room.databaseBuilder(
                    context.applicationContext,
                    AppDatabase::class.java,
                    "app_database"
                ).build()
                INSTANCE = instance
                instance
            }
        }
    }
}`;
  }

  /**
   * Generate Compose screen content
   */
  private async generateComposeScreenContent(page: any, paam: PAAM, options: AndroidGenerationOptions): Promise<string> {
    const template = this.templates.get('compose-screen') || '';
    
    return template
      .replace(/{{name}}/g, page.name)
      .replace(/{{title}}/g, page.title)
      .replace(/{{components}}/g, page.components.join(', '));
  }

  /**
   * Generate Compose component content
   */
  private async generateComposeComponentContent(component: any, options: AndroidGenerationOptions): Promise<string> {
    const template = this.templates.get('compose-component') || '';
    
    return template
      .replace(/{{name}}/g, component.name)
      .replace(/{{type}}/g, component.type)
      .replace(/{{config}}/g, JSON.stringify(component.config, null, 2));
  }

  /**
   * Generate ViewModel content
   */
  private generateViewModelContent(entity: any, options: AndroidGenerationOptions): string {
    return `package com.example.app.ui.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.app.data.model.${entity.name}
import com.example.app.data.repository.${entity.name}Repository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class ${entity.name}ViewModel @Inject constructor(
    private val repository: ${entity.name}Repository
) : ViewModel() {
    
    private val _${entity.name.toLowerCase()}s = MutableStateFlow<List<${entity.name}>>(emptyList())
    val ${entity.name.toLowerCase()}s: StateFlow<List<${entity.name}>> = _${entity.name.toLowerCase()}s
    
    private val _isLoading = MutableStateFlow(false)
    val isLoading: StateFlow<Boolean> = _isLoading
    
    private val _error = MutableStateFlow<String?>(null)
    val error: StateFlow<String?> = _error
    
    init {
        load${entity.name}s()
    }
    
    private fun load${entity.name}s() {
        viewModelScope.launch {
            _isLoading.value = true
            try {
                repository.getAll${entity.name}s()
                    .collect { ${entity.name.toLowerCase()}s ->
                        _${entity.name.toLowerCase()}s.value = ${entity.name.toLowerCase()}s
                    }
            } catch (e: Exception) {
                _error.value = e.message
            } finally {
                _isLoading.value = false
            }
        }
    }
    
    fun create${entity.name}(${entity.name.toLowerCase()}: ${entity.name}) {
        viewModelScope.launch {
            _isLoading.value = true
            try {
                repository.insert${entity.name}(${entity.name.toLowerCase()})
                load${entity.name}s()
            } catch (e: Exception) {
                _error.value = e.message
            } finally {
                _isLoading.value = false
            }
        }
    }
    
    fun update${entity.name}(${entity.name.toLowerCase()}: ${entity.name}) {
        viewModelScope.launch {
            _isLoading.value = true
            try {
                repository.update${entity.name}(${entity.name.toLowerCase()})
                load${entity.name}s()
            } catch (e: Exception) {
                _error.value = e.message
            } finally {
                _isLoading.value = false
            }
        }
    }
    
    fun delete${entity.name}(${entity.name.toLowerCase()}: ${entity.name}) {
        viewModelScope.launch {
            _isLoading.value = true
            try {
                repository.delete${entity.name}(${entity.name.toLowerCase()})
                load${entity.name}s()
            } catch (e: Exception) {
                _error.value = e.message
            } finally {
                _isLoading.value = false
            }
        }
    }
}`;
  }

  /**
   * Generate API service content
   */
  private generateAPIServiceContent(paam: PAAM, options: AndroidGenerationOptions): string {
    return `package com.example.app.data.network

import com.example.app.data.model.*
import retrofit2.http.*
import retrofit2.Response

interface APIService {
    // Entity-specific endpoints will be generated here
    
    @GET("health")
    suspend fun healthCheck(): Response<HealthResponse>
}

data class HealthResponse(
    val status: String,
    val timestamp: String
)`;
  }

  /**
   * Generate repository content
   */
  private generateRepositoryContent(paam: PAAM, options: AndroidGenerationOptions): string {
    return `package com.example.app.data.repository

import com.example.app.data.network.APIService
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class AppRepository @Inject constructor(
    private val apiService: APIService
) {
    suspend fun healthCheck() = apiService.healthCheck()
}`;
  }

  /**
   * Generate entity repository content
   */
  private generateEntityRepositoryContent(entity: any, options: AndroidGenerationOptions): string {
    return `package com.example.app.data.repository

import com.example.app.data.dao.${entity.name}Dao
import com.example.app.data.model.${entity.name}
import kotlinx.coroutines.flow.Flow
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class ${entity.name}Repository @Inject constructor(
    private val ${entity.name.toLowerCase()}Dao: ${entity.name}Dao
) {
    fun getAll${entity.name}s(): Flow<List<${entity.name}>> = ${entity.name.toLowerCase()}Dao.getAll${entity.name}s()
    
    suspend fun get${entity.name}ById(id: Long): ${entity.name}? = ${entity.name.toLowerCase()}Dao.get${entity.name}ById(id)
    
    suspend fun insert${entity.name}(${entity.name.toLowerCase()}: ${entity.name}): Long = ${entity.name.toLowerCase()}Dao.insert${entity.name}(${entity.name.toLowerCase()})
    
    suspend fun update${entity.name}(${entity.name.toLowerCase()}: ${entity.name}) = ${entity.name.toLowerCase()}Dao.update${entity.name}(${entity.name.toLowerCase()})
    
    suspend fun delete${entity.name}(${entity.name.toLowerCase()}: ${entity.name}) = ${entity.name.toLowerCase()}Dao.delete${entity.name}(${entity.name.toLowerCase()})
    
    suspend fun deleteAll${entity.name}s() = ${entity.name.toLowerCase()}Dao.deleteAll${entity.name}s()
}`;
  }

  /**
   * Generate build.gradle.kts content
   */
  private generateBuildGradleContent(paam: PAAM, options: AndroidGenerationOptions): string {
    return `plugins {
    alias(libs.plugins.com.android.application)
    alias(libs.plugins.org.jetbrains.kotlin.android)
    alias(libs.plugins.hilt.android)
    alias(libs.plugins.kotlin.kapt)
    alias(libs.plugins.kotlin.parcelize)
}

android {
    namespace = "com.example.app"
    compileSdk = 34

    defaultConfig {
        applicationId = "com.example.app"
        minSdk = 24
        targetSdk = 34
        versionCode = 1
        versionName = "1.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
        vectorDrawables {
            useSupportLibrary = true
        }
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }
    
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_1_8
        targetCompatibility = JavaVersion.VERSION_1_8
    }
    
    kotlinOptions {
        jvmTarget = "1.8"
    }
    
    buildFeatures {
        compose = true
    }
    
    composeOptions {
        kotlinCompilerExtensionVersion = "1.5.1"
    }
    
    packaging {
        resources {
            excludes += "/META-INF/{AL2.0,LGPL2.1}"
        }
    }
}

dependencies {
    implementation(libs.core.ktx)
    implementation(libs.lifecycle.runtime.ktx)
    implementation(libs.activity.compose)
    implementation(platform(libs.compose.bom))
    implementation(libs.ui)
    implementation(libs.ui.graphics)
    implementation(libs.ui.tooling.preview)
    implementation(libs.material3)
    
    // Hilt for dependency injection
    implementation(libs.hilt.android)
    kapt(libs.hilt.compiler)
    
    // Room for database
    implementation(libs.room.runtime)
    implementation(libs.room.ktx)
    kapt(libs.room.compiler)
    
    // Retrofit for networking
    implementation(libs.retrofit.core)
    implementation(libs.retrofit.gson)
    implementation(libs.okhttp.logging)
    
    // Coroutines
    implementation(libs.kotlinx.coroutines.android)
    
    // Navigation
    implementation(libs.navigation.compose)
    implementation(libs.hilt.navigation.compose)
    
    // Testing
    testImplementation(libs.junit)
    androidTestImplementation(libs.ext.junit)
    androidTestImplementation(libs.espresso.core)
    androidTestImplementation(platform(libs.compose.bom))
    androidTestImplementation(libs.ui.test.junit4)
    debugImplementation(libs.ui.tooling)
    debugImplementation(libs.ui.test.manifest)
}`;
  }

  /**
   * Generate AndroidManifest.xml content
   */
  private generateAndroidManifestContent(paam: PAAM): string {
    return `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools">

    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />

    <application
        android:name=".AppApplication"
        android:allowBackup="true"
        android:dataExtractionRules="@xml/data_extraction_rules"
        android:fullBackupContent="@xml/backup_rules"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.App"
        tools:targetApi="31">
        
        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:label="@string/app_name"
            android:theme="@style/Theme.App">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
        
    </application>

</manifest>`;
  }

  /**
   * Generate strings.xml content
   */
  private generateStringsContent(paam: PAAM): string {
    return `<resources>
    <string name="app_name">${paam.metadata.name}</string>
    <string name="app_description">${paam.metadata.description}</string>
    
    <!-- Common strings -->
    <string name="loading">Loading...</string>
    <string name="error">Error</string>
    <string name="retry">Retry</string>
    <string name="save">Save</string>
    <string name="cancel">Cancel</string>
    <string name="delete">Delete</string>
    <string name="edit">Edit</string>
    <string name="create">Create</string>
    <string name="update">Update</string>
    
    <!-- Entity strings will be generated here -->
</resources>`;
  }

  /**
   * Generate colors.xml content
   */
  private generateColorsContent(paam: PAAM): string {
    return `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="primary">#${paam.ui.theme.primaryColor.replace('#', '')}</color>
    <color name="primary_variant">#${this.darkenColor(paam.ui.theme.primaryColor)}</color>
    <color name="secondary">#${paam.ui.theme.secondaryColor.replace('#', '')}</color>
    <color name="secondary_variant">#${this.darkenColor(paam.ui.theme.secondaryColor)}</color>
    <color name="background">#${paam.ui.theme.backgroundColor.replace('#', '')}</color>
    <color name="surface">#${paam.ui.theme.backgroundColor.replace('#', '')}</color>
    <color name="on_primary">#${paam.ui.theme.textColor.replace('#', '')}</color>
    <color name="on_secondary">#${paam.ui.theme.textColor.replace('#', '')}</color>
    <color name="on_background">#${paam.ui.theme.textColor.replace('#', '')}</color>
    <color name="on_surface">#${paam.ui.theme.textColor.replace('#', '')}</color>
    <color name="error">#FF5252</color>
    <color name="on_error">#FFFFFF</color>
</resources>`;
  }

  /**
   * Generate extensions content
   */
  private generateExtensionsContent(): string {
    return `package com.example.app.utils

import android.content.Context
import androidx.compose.runtime.Composable
import androidx.compose.ui.res.stringResource
import java.text.SimpleDateFormat
import java.util.*

fun String.isValidEmail(): Boolean {
    return android.util.Patterns.EMAIL_ADDRESS.matcher(this).matches()
}

fun Date.formatToString(pattern: String = "MMM dd, yyyy"): String {
    val sdf = SimpleDateFormat(pattern, Locale.getDefault())
    return sdf.format(this)
}

fun Long.formatAsCurrency(): String {
    return String.format("$%,.2f", this / 100.0)
}

@Composable
fun stringResourceSafe(id: Int, default: String = ""): String {
    return try {
        stringResource(id)
    } catch (e: Exception) {
        default
    }
}

fun Context.dpToPx(dp: Float): Float {
    return dp * resources.displayMetrics.density
}

fun Context.pxToDp(px: Float): Float {
    return px / resources.displayMetrics.density
}`;
  }

  /**
   * Generate constants content
   */
  private generateConstantsContent(): string {
    return `package com.example.app.utils

object Constants {
    const val BASE_URL = "https://api.example.com"
    const val DATABASE_NAME = "app_database"
    const val PREFERENCES_NAME = "app_preferences"
    
    // API Endpoints
    object Api {
        const val HEALTH = "/health"
        const val USERS = "/users"
        const val AUTH = "/auth"
    }
    
    // Preferences Keys
    object Preferences {
        const val THEME = "theme"
        const val LANGUAGE = "language"
        const val USER_ID = "user_id"
    }
    
    // Request timeouts
    const val CONNECT_TIMEOUT = 30L
    const val READ_TIMEOUT = 30L
    const val WRITE_TIMEOUT = 30L
    
    // Pagination
    const val DEFAULT_PAGE_SIZE = 20
    const val MAX_PAGE_SIZE = 100
}`;
  }

  /**
   * Generate theme content
   */
  private generateThemeContent(paam: PAAM): string {
    return `package com.example.app.ui.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

private val DarkColorScheme = darkColorScheme(
    primary = Color(0xFF${paam.ui.theme.primaryColor.replace('#', '')}),
    secondary = Color(0xFF${paam.ui.theme.secondaryColor.replace('#', '')}),
    tertiary = Color(0xFF${paam.ui.theme.primaryColor.replace('#', '')}),
    background = Color(0xFF${paam.ui.theme.backgroundColor.replace('#', '')}),
    surface = Color(0xFF${paum.ui.theme.backgroundColor.replace('#', '')}),
    onPrimary = Color(0xFF${paam.ui.theme.textColor.replace('#', '')}),
    onSecondary = Color(0xFF${paam.ui.theme.textColor.replace('#', '')}),
    onTertiary = Color(0xFF${paam.ui.theme.textColor.replace('#', '')}),
    onBackground = Color(0xFF${paam.ui.theme.textColor.replace('#', '')}),
    onSurface = Color(0xFF${paam.ui.theme.textColor.replace('#', '')}),
)

private val LightColorScheme = lightColorScheme(
    primary = Color(0xFF${paam.ui.theme.primaryColor.replace('#', '')}),
    secondary = Color(0xFF${paam.ui.theme.secondaryColor.replace('#', '')}),
    tertiary = Color(0xFF${paam.ui.theme.primaryColor.replace('#', '')}),
    background = Color(0xFF${paam.ui.theme.backgroundColor.replace('#', '')}),
    surface = Color(0xFF${paam.ui.theme.backgroundColor.replace('#', '')}),
    onPrimary = Color(0xFF${paam.ui.theme.textColor.replace('#', '')}),
    onSecondary = Color(0xFF${paam.ui.theme.textColor.replace('#', '')}),
    onTertiary = Color(0xFF${paam.ui.theme.textColor.replace('#', '')}),
    onBackground = Color(0xFF${paam.ui.theme.textColor.replace('#', '')}),
    onSurface = Color(0xFF${paam.ui.theme.textColor.replace('#', '')}),
)

@Composable
fun AppTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit
) {
    val colorScheme = if (darkTheme) {
        DarkColorScheme
    } else {
        LightColorScheme
    }

    MaterialTheme(
        colorScheme = colorScheme,
        typography = Typography,
        shapes = Shapes,
        content = content
    )
}`;
  }

  /**
   * Map PAAM type to Kotlin type
   */
  private getKotlinType(paamType: string): string {
    const typeMap: Record<string, string> = {
      'string': 'String',
      'text': 'String',
      'integer': 'Int',
      'float': 'Float',
      'boolean': 'Boolean',
      'date': 'Date',
      'datetime': 'Date',
      'time': 'Date',
      'email': 'String',
      'url': 'String',
      'file': 'String',
      'image': 'String',
      'json': 'String',
      'uuid': 'String',
      'enum': 'String',
      'reference': 'Long'
    };

    return typeMap[paamType] || 'String';
  }

  /**
   * Format default value
   */
  private formatDefaultValue(value: any, type: string): string {
    if (typeof value === 'string') {
      return `"${value}"`;
    }
    if (typeof value === 'boolean') {
      return value ? 'true' : 'false';
    }
    if (typeof value === 'number') {
      return value.toString();
    }
    return '""';
  }

  /**
   * Darken color
   */
  private darkenColor(color: string): string {
    // Simple color darkening - in a real implementation, this would be more sophisticated
    return color.replace('#', '').substring(0, 6);
  }

  /**
   * Initialize templates
   */
  private initializeTemplates(): void {
    this.templates.set('compose-screen', `
package com.example.app.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import com.example.app.ui.viewmodel.{{name}}ViewModel

@Composable
fun {{name}}Screen(
    viewModel: {{name}}ViewModel = hiltViewModel()
) {
    val ${entity.name.toLowerCase()}s by viewModel.${entity.name.toLowerCase()}s.collectAsState()
    val isLoading by viewModel.isLoading.collectAsState()
    val error by viewModel.error.collectAsState()
    
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Top
    ) {
        Text(
            text = "{{title}}",
            style = MaterialTheme.typography.headlineMedium,
            modifier = Modifier.padding(bottom = 16.dp)
        )
        
        when {
            isLoading -> {
                CircularProgressIndicator()
            }
            error != null -> {
                Text(
                    text = error ?: "Unknown error",
                    color = MaterialTheme.colorScheme.error
                )
            }
            else -> {
                // Screen content will be generated based on PAAM components
                LazyColumn {
                    items(${entity.name.toLowerCase()}s.size) { index ->
                        val ${entity.name.toLowerCase()} = ${entity.name.toLowerCase()}s[index]
                        // Item content
                    }
                }
            }
        }
    }
}`);

    this.templates.set('compose-component', `
package com.example.app.ui.components

import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp

@Composable
fun {{name}}Component(
    modifier: Modifier = Modifier,
    // Component parameters will be generated based on config
) {
    Card(
        modifier = modifier.fillMaxWidth(),
        elevation = CardDefaults.cardElevation(defaultElevation = 4.dp)
    ) {
        Column(
            modifier = Modifier.padding(16.dp)
        ) {
            Text(
                text = "{{name}}",
                style = MaterialTheme.typography.titleMedium
            )
            Spacer(modifier = Modifier.height(8.dp))
            // Component content based on type and config
        }
    }
}`);
  }

  /**
   * Initialize generators
   */
  private initializeGenerators(): void {
    // Initialize specialized generators for different component types
    this.generators.set('form', this.generateComposeForm.bind(this));
    this.generators.set('table', this.generateComposeTable.bind(this));
    this.generators.set('list', this.generateComposeList.bind(this));
  }

  /**
   * Load templates
   */
  private async loadTemplates(): Promise<void> {
    console.log('Loading Android templates...');
  }

  /**
   * Load generators
   */
  private async loadGenerators(): Promise<void> {
    console.log('Loading Android generators...');
  }

  /**
   * Generate Compose form
   */
  private async generateComposeForm(config: any): Promise<string> {
    return `// Jetpack Compose form generation`;
  }

  /**
   * Generate Compose table
   */
  private async generateComposeTable(config: any): Promise<string> {
    return `// Jetpack Compose table generation`;
  }

  /**
   * Generate Compose list
   */
  private async generateComposeList(config: any): Promise<string> {
    return `// Jetpack Compose list generation`;
  }

  /**
   * Generate project structure
   */
  private async generateProjectStructure(request: AndroidGenerationRequest): Promise<void> {
    console.log(`Generating Android project structure at: ${request.outputPath}`);
  }
}