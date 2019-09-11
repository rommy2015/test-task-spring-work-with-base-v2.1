package com.task.test.users.dao.config;


import org.apache.commons.dbcp2.BasicDataSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.core.env.Environment;
import org.springframework.dao.annotation.PersistenceExceptionTranslationPostProcessor;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.orm.jpa.AbstractEntityManagerFactoryBean;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.orm.jpa.JpaVendorAdapter;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.orm.jpa.support.PersistenceAnnotationBeanPostProcessor;
import org.springframework.orm.jpa.vendor.HibernateJpaVendorAdapter;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import javax.persistence.EntityManagerFactory;
import javax.sql.DataSource;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.util.Properties;

@PropertySource( value = {"classpath:jdbc/jdbc.properties"}  )
@Configuration
@EnableTransactionManagement
@ComponentScan( basePackages = {"com.task.test.users.dao"} )
@EnableJpaRepositories(basePackages = {"com.task.test.users.dao.repository"})
public class JpaConfigPersistence {


    private Environment env;

    @Autowired
    public JpaConfigPersistence(Environment env) {
        this.env =  env;
    }


    @Bean
    public DataSource dataSource(){

        BasicDataSource dataSource = new BasicDataSource();

        @NotEmpty
        String propertyDriverMySql = env.getProperty("jdbc.driverClassName");

        @NotEmpty
        String propertyUrl = env.getProperty("jdbc.url");

        @NotEmpty
        String propertyUserName = env.getProperty("jdbc.username");

        @NotEmpty
        String propertyPassword = env.getProperty("jdbc.password");

        dataSource.setDriverClassName(propertyDriverMySql);
        dataSource.setUrl(propertyUrl);
        dataSource.setUsername(propertyUserName);
        dataSource.setPassword(propertyPassword);

        dataSource.setMaxConnLifetimeMillis(10000);
        dataSource.setMaxIdle(15);
        dataSource.setInitialSize(15);
        dataSource.setValidationQuery("SELECT 1");

        return dataSource;

    }

    @Bean
    public JpaVendorAdapter jpaVendorAdapter() {

        @NotNull
        String dataBasePlatform = env.getProperty("hibernate.databasePlatform");

        String dialectDataBase = env.getProperty("hibernate.dialect");

        HibernateJpaVendorAdapter adapter = new HibernateJpaVendorAdapter();
        adapter.setDatabasePlatform(dataBasePlatform);
        adapter.setShowSql(true);
        adapter.setDatabasePlatform(dialectDataBase);

        return adapter;
    }

    private Properties additionalJpaProperties() {

        String isFormatSql = env.getProperty("hibernate.show_sql");
       /* String hbm2ddlAuto = env.getProperty("hibernate.hbm2ddl.auto");*/
        String levelCache = env.getProperty("hibernate.cache.use_second_level_cache");
        String queryCache = env.getProperty("hibernate.cache.use_query_cache");

        Properties properties = new Properties();

        properties.setProperty("hibernate.format_sql", isFormatSql);
       /* properties.setProperty("hibernate.hbm2ddl.auto",hbm2ddlAuto);*/
        properties.setProperty("hibernate.cache.use_second_level_cache", levelCache);
        properties.setProperty("hibernate.cache.use_query_cache",queryCache);

        return properties;
    }

    @Bean
    public AbstractEntityManagerFactoryBean entityManagerFactory(DataSource dataSource,
                                                                 JpaVendorAdapter jpaVendorAdapter) {
        LocalContainerEntityManagerFactoryBean entityManagerFactory =
                new LocalContainerEntityManagerFactoryBean();

        entityManagerFactory.setPackagesToScan("com.task.test.users.dao.domain");
        entityManagerFactory.setDataSource(dataSource);
        entityManagerFactory.setJpaVendorAdapter(jpaVendorAdapter);

        entityManagerFactory.setJpaProperties(additionalJpaProperties());

        return entityManagerFactory;
    }

    @Bean
    public PlatformTransactionManager transactionManager(final EntityManagerFactory emf) {

        final JpaTransactionManager transactionManager = new JpaTransactionManager();
        transactionManager.setEntityManagerFactory(emf);
        return transactionManager;
    }


    @Bean
    public PersistenceExceptionTranslationPostProcessor exceptionTranslation(){
        return new PersistenceExceptionTranslationPostProcessor();
    }

}
