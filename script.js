// 页面加载完成后执行
window.addEventListener('DOMContentLoaded', function() {
    // 检测是否是页面刷新（reload）
    const isReload = performance.getEntriesByType('navigation').some(nav => nav.type === 'reload');
    
    if (isReload) {
        // 页面刷新时清空所有勾选状态
        sessionStorage.removeItem('selectedFunctions');
        sessionStorage.removeItem('ecuNames');
        sessionStorage.removeItem('generatedFunctions');
    }
    
    // 初始化导航菜单功能
    initNavigation();
    
    // 初始化文件上传功能
    initFileUpload();
    
    // 初始化树节点功能
    initTreeNodes();
    
    // 初始化标签页功能
    initTabs();
    
    // 初始化操作按钮功能
    initActionButtons();
    
    // 初始化项目管理功能
    initProjectManagement();
    
    // 初始化实验设置功能
    initExperimentSetup();
    
    // 初始化项目详情功能
    initProjectDetail();
    
    // 初始化文件操作功能
    initFileActions();
    
    // 初始化脚本评审功能
    initScriptReview();
    
    // 标记初始化完成
    window.appInitialized = true;
});

// 初始化导航菜单功能
function initNavigation() {
    const menuLinks = document.querySelectorAll('.menu-link');
    const subMenuLinks = document.querySelectorAll('.sub-menu-link');
    
    // 主菜单点击事件
    menuLinks.forEach(function(link) {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // 移除所有主菜单项的激活状态
            menuLinks.forEach(function(item) {
                item.closest('.menu-item').classList.remove('active');
            });
            
            // 激活当前主菜单项
            this.closest('.menu-item').classList.add('active');
        });
    });
    
    // 子菜单点击事件
    subMenuLinks.forEach(function(link) {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // 获取页面标识
            const pageId = this.getAttribute('data-page');
            
            // 如果没有页面标识，不执行任何操作
            if (!pageId) {
                return;
            }
            
            // 移除所有子菜单项的激活状态
            subMenuLinks.forEach(function(item) {
                item.closest('.sub-menu-item').classList.remove('active');
            });
            
            // 激活当前子菜单项
            this.closest('.sub-menu-item').classList.add('active');
            
            // 切换页面
            switchPage(pageId);
        });
    });
}

// 切换页面
function switchPage(pageId) {
    // 隐藏所有页面
    const allPages = document.querySelectorAll('.page-content');
    allPages.forEach(page => page.classList.remove('active'));
    
    // 显示目标页面
    const targetPage = document.getElementById('page-' + pageId);
    if (targetPage) {
        targetPage.classList.add('active');
    }
    
    // 根据页面ID初始化相应的功能
    if (pageId === 'logic-check') {
        initLogicCheck();
    }
    
    if (pageId === 'script-result') {
        initScriptResult();
    }
    
    if (pageId === 'project-detail') {
        initProjectDetail();
    }
}

// 显示进度条并开始动画
function showProgressBar() {
    // 获取进度条元素
    const progressBar = document.getElementById('progressBar');
    const progressPercentage = document.getElementById('progressPercentage');
    const progressSection = document.querySelector('.progress-section');
    
    if (!progressBar || !progressPercentage || !progressSection) return;
    
    // 显示进度条区域
    progressSection.style.display = 'block';
    
    // 重置进度条
    progressBar.style.width = '0%';
    progressPercentage.textContent = '0%';
    
    // 动画持续时间：5秒
    const duration = 5000;
    const startTime = Date.now();
    
    // 动画函数
    function animateProgress() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const percentage = Math.round(progress * 100);
        
        // 更新进度条
        progressBar.style.width = percentage + '%';
        progressPercentage.textContent = percentage + '%';
        
        // 继续动画
        if (progress < 1) {
            requestAnimationFrame(animateProgress);
        } else {
            // 动画完成，隐藏进度条，显示代码对比区域
            setTimeout(function() {
                if (progressSection) {
                    progressSection.style.display = 'none';
                }
                const codeCompareSection = document.querySelector('.code-compare-section');
                if (codeCompareSection) {
                    codeCompareSection.style.display = 'block';
                }
            }, 500);
        }
    }
    
    // 开始动画
    requestAnimationFrame(animateProgress);
}

// 示例代码数据
const codeFiles = {
    'test_engine.py': `# -*- coding: utf-8 -*-
"""
发动机测试脚本
Test Engine Module
"""

import pytest
import time
from config import EngineConfig
from utils import log_result, check_signal


class TestEngine:
    """发动机功能测试类"""
    
    def setup_method(self):
        """测试前置设置"""
        self.engine = EngineConfig()
        self.engine.initialize()
        print("Engine test setup completed")
    
    def teardown_method(self):
        """测试后置清理"""
        self.engine.shutdown()
        print("Engine test teardown completed")
    
    def test_engine_start(self):
        """测试发动机启动功能"""
        print("=== Testing Engine Start ===")
        
        # 检查发动机状态
        result = self.engine.check_status()
        log_result("Engine status check", result)
        assert result, "Engine status check failed"
        
        # 启动发动机
        start_result = self.engine.start()
        log_result("Engine start", start_result)
        assert start_result, "Engine start failed"
        
        # 检查发动机转速
        rpm = self.engine.get_rpm()
        print(f"Engine RPM: {rpm}")
        assert rpm > 0, "Engine RPM should be greater than 0"
        
        # 运行一段时间
        time.sleep(2)
        
        # 检查发动机温度
        temperature = self.engine.get_temperature()
        print(f"Engine temperature: {temperature}°C")
        assert temperature < 100, "Engine temperature too high"
        
        print("Engine start test passed!")
    
    def test_engine_stop(self):
        """测试发动机停止功能"""
        print("=== Testing Engine Stop ===")
        
        # 启动发动机
        start_result = self.engine.start()
        assert start_result, "Engine start failed"
        
        # 运行一段时间
        time.sleep(1)
        
        # 停止发动机
        stop_result = self.engine.stop()
        log_result("Engine stop", stop_result)
        assert stop_result, "Engine stop failed"
        
        # 检查发动机状态
        status = self.engine.check_status()
        assert not status, "Engine should be stopped"
        
        print("Engine stop test passed!")


if __name__ == "__main__":
    pytest.main([__file__, "-v"])`,
    'test_abs.py': `# -*- coding: utf-8 -*-
"""
ABS制动系统测试脚本
Test ABS Module
"""

import pytest
import time
from config import ABSConfig
from utils import log_result, check_signal


class TestABS:
    """ABS系统测试类"""
    
    def setup_method(self):
        """测试前置设置"""
        self.abs = ABSConfig()
        self.abs.initialize()
        print("ABS test setup completed")
    
    def teardown_method(self):
        """测试后置清理"""
        self.abs.shutdown()
        print("ABS test teardown completed")
    
    def test_abs_functionality(self):
        """测试ABS系统功能"""
        print("=== Testing ABS Functionality ===")
        
        # 检查ABS状态
        status = self.abs.check_status()
        log_result("ABS status check", status)
        assert status, "ABS status check failed"
        
        # 模拟紧急制动
        print("Simulating emergency braking...")
        brake_result = self.abs.emergency_brake()
        log_result("Emergency brake", brake_result)
        assert brake_result, "Emergency brake failed"
        
        # 检查ABS激活状态
        abs_active = self.abs.is_abs_active()
        log_result("ABS active", abs_active)
        assert abs_active, "ABS should be active during emergency braking"
        
        # 检查轮速传感器数据
        wheel_speeds = self.abs.get_wheel_speeds()
        print(f"Wheel speeds: {wheel_speeds}")
        for speed in wheel_speeds.values():
            assert speed >= 0, "Wheel speed should be non-negative"
        
        print("ABS functionality test passed!")
    
    def test_abs_error_handling(self):
        """测试ABS系统错误处理"""
        print("=== Testing ABS Error Handling ===")
        
        # 模拟传感器故障
        print("Simulating sensor failure...")
        error_code = self.abs.simulate_sensor_failure()
        print(f"Error code: {error_code}")
        
        # 检查故障处理
        error_handled = self.abs.handle_error(error_code)
        log_result("Error handling", error_handled)
        assert error_handled, "Error handling failed"
        
        print("ABS error handling test passed!")


if __name__ == "__main__":
    pytest.main([__file__, "-v"])`,
    'test_transmission.py': `# -*- coding: utf-8 -*-
"""
变速箱测试脚本
Test Transmission Module
"""

import pytest
import time
from config import TransmissionConfig
from utils import log_result, check_signal


class TestTransmission:
    """变速箱测试类"""
    
    def setup_method(self):
        """测试前置设置"""
        self.transmission = TransmissionConfig()
        self.transmission.initialize()
        print("Transmission test setup completed")
    
    def teardown_method(self):
        """测试后置清理"""
        self.transmission.shutdown()
        print("Transmission test teardown completed")
    
    def test_gear_shifting(self):
        """测试变速箱换挡功能"""
        print("=== Testing Gear Shifting ===")
        
        # 检查变速箱状态
        status = self.transmission.check_status()
        log_result("Transmission status check", status)
        assert status, "Transmission status check failed"
        
        # 测试从P档到D档
        print("Shifting from P to D...")
        shift_result = self.transmission.shift_gear('P', 'D')
        log_result("Shift P->D", shift_result)
        assert shift_result, "Shift P->D failed"
        
        # 检查当前档位
        current_gear = self.transmission.get_current_gear()
        print(f"Current gear: {current_gear}")
        assert current_gear == 'D', f"Expected gear D, got {current_gear}"
        
        # 测试从D档到R档
        print("Shifting from D to R...")
        shift_result = self.transmission.shift_gear('D', 'R')
        log_result("Shift D->R", shift_result)
        assert shift_result, "Shift D->R failed"
        
        # 检查当前档位
        current_gear = self.transmission.get_current_gear()
        print(f"Current gear: {current_gear}")
        assert current_gear == 'R', f"Expected gear R, got {current_gear}"
        
        print("Gear shifting test passed!")
    
    def test_transmission_modes(self):
        """测试变速箱模式"""
        print("=== Testing Transmission Modes ===")
        
        # 测试运动模式
        print("Setting sport mode...")
        sport_mode_result = self.transmission.set_mode('sport')
        log_result("Set sport mode", sport_mode_result)
        assert sport_mode_result, "Set sport mode failed"
        
        # 测试经济模式
        print("Setting eco mode...")
        eco_mode_result = self.transmission.set_mode('eco')
        log_result("Set eco mode", eco_mode_result)
        assert eco_mode_result, "Set eco mode failed"
        
        print("Transmission modes test passed!")


if __name__ == "__main__":
    pytest.main([__file__, "-v"])`,
    'test_brake.py': `# -*- coding: utf-8 -*-
"""
制动系统测试脚本
Test Brake Module
"""

import pytest
import time
from config import BrakeConfig
from utils import log_result, check_signal


class TestBrake:
    """制动系统测试类"""
    
    def setup_method(self):
        """测试前置设置"""
        self.brake = BrakeConfig()
        self.brake.initialize()
        print("Brake test setup completed")
    
    def teardown_method(self):
        """测试后置清理"""
        self.brake.shutdown()
        print("Brake test teardown completed")
    
    def test_brake_performance(self):
        """测试制动系统性能"""
        print("=== Testing Brake Performance ===")
        
        # 检查制动系统状态
        status = self.brake.check_status()
        log_result("Brake status check", status)
        assert status, "Brake status check failed"
        
        # 测试常规制动
        print("Testing normal braking...")
        brake_result = self.brake.apply_brake(50)  # 50%制动力度
        log_result("Normal brake", brake_result)
        assert brake_result, "Normal brake failed"
        
        # 测试紧急制动
        print("Testing emergency braking...")
        emergency_brake_result = self.brake.apply_brake(100)  # 100%制动力度
        log_result("Emergency brake", emergency_brake_result)
        assert emergency_brake_result, "Emergency brake failed"
        
        # 检查制动液压力
        brake_pressure = self.brake.get_brake_pressure()
        print(f"Brake pressure: {brake_pressure} bar")
        assert brake_pressure > 0, "Brake pressure should be greater than 0"
        
        print("Brake performance test passed!")
    
    def test_brake_abs_integration(self):
        """测试制动系统与ABS集成"""
        print("=== Testing Brake-ABS Integration ===")
        
        # 检查ABS集成状态
        abs_integration = self.brake.check_abs_integration()
        log_result("ABS integration check", abs_integration)
        assert abs_integration, "ABS integration check failed"
        
        # 模拟湿滑路面制动
        print("Simulating braking on slippery road...")
        slippery_brake_result = self.brake.apply_brake_on_slippery_road()
        log_result("Slippery road brake", slippery_brake_result)
        assert slippery_brake_result, "Slippery road brake failed"
        
        print("Brake-ABS integration test passed!")


if __name__ == "__main__":
    pytest.main([__file__, "-v"])`,
    'config.py': `# -*- coding: utf-8 -*-
"""
配置文件
Configuration Module
"""

class EngineConfig:
    """发动机配置类"""
    
    def initialize(self):
        """初始化发动机配置"""
        print("Initializing Engine Config...")
        # 模拟初始化过程
        return True
    
    def shutdown(self):
        """关闭发动机配置"""
        print("Shutting down Engine Config...")
        # 模拟关闭过程
        return True
    
    def check_status(self):
        """检查发动机状态"""
        # 模拟状态检查
        return True
    
    def start(self):
        """启动发动机"""
        print("Starting engine...")
        # 模拟启动过程
        return True
    
    def stop(self):
        """停止发动机"""
        print("Stopping engine...")
        # 模拟停止过程
        return True
    
    def get_rpm(self):
        """获取发动机转速"""
        # 模拟获取转速
        return 1500
    
    def get_temperature(self):
        """获取发动机温度"""
        # 模拟获取温度
        return 85


class ABSConfig:
    """ABS系统配置类"""
    
    def initialize(self):
        """初始化ABS配置"""
        print("Initializing ABS Config...")
        # 模拟初始化过程
        return True
    
    def shutdown(self):
        """关闭ABS配置"""
        print("Shutting down ABS Config...")
        # 模拟关闭过程
        return True
    
    def check_status(self):
        """检查ABS状态"""
        # 模拟状态检查
        return True
    
    def emergency_brake(self):
        """紧急制动"""
        print("Performing emergency brake...")
        # 模拟紧急制动
        return True
    
    def is_abs_active(self):
        """检查ABS是否激活"""
        # 模拟检查ABS激活状态
        return True
    
    def get_wheel_speeds(self):
        """获取轮速传感器数据"""
        # 模拟获取轮速数据
        return {
            'front_left': 45,
            'front_right': 46,
            'rear_left': 44,
            'rear_right': 45
        }
    
    def simulate_sensor_failure(self):
        """模拟传感器故障"""
        # 模拟传感器故障
        return "SENSOR_FAILURE"
    
    def handle_error(self, error_code):
        """处理错误"""
        print(f"Handling error: {error_code}")
        # 模拟错误处理
        return True


class TransmissionConfig:
    """变速箱配置类"""
    
    def initialize(self):
        """初始化变速箱配置"""
        print("Initializing Transmission Config...")
        # 模拟初始化过程
        return True
    
    def shutdown(self):
        """关闭变速箱配置"""
        print("Shutting down Transmission Config...")
        # 模拟关闭过程
        return True
    
    def check_status(self):
        """检查变速箱状态"""
        # 模拟状态检查
        return True
    
    def shift_gear(self, from_gear, to_gear):
        """换挡"""
        print(f"Shifting from {from_gear} to {to_gear}...")
        # 模拟换挡过程
        return True
    
    def get_current_gear(self):
        """获取当前档位"""
        # 模拟获取当前档位
        return "D"
    
    def set_mode(self, mode):
        """设置变速箱模式"""
        print(f"Setting transmission mode to {mode}...")
        # 模拟设置模式
        return True


class BrakeConfig:
    """制动系统配置类"""
    
    def initialize(self):
        """初始化制动系统配置"""
        print("Initializing Brake Config...")
        # 模拟初始化过程
        return True
    
    def shutdown(self):
        """关闭制动系统配置"""
        print("Shutting down Brake Config...")
        # 模拟关闭过程
        return True
    
    def check_status(self):
        """检查制动系统状态"""
        # 模拟状态检查
        return True
    
    def apply_brake(self, pressure):
        """施加制动"""
        print(f"Applying brake with {pressure}% pressure...")
        # 模拟施加制动
        return True
    
    def get_brake_pressure(self):
        """获取制动液压力"""
        # 模拟获取制动液压力
        return 15.5
    
    def check_abs_integration(self):
        """检查与ABS的集成"""
        # 模拟检查集成状态
        return True
    
    def apply_brake_on_slippery_road(self):
        """在湿滑路面上施加制动"""
        print("Applying brake on slippery road...")
        # 模拟湿滑路面制动
        return True


# 全局配置实例
engine_config = EngineConfig()
abs_config = ABSConfig()
transmission_config = TransmissionConfig()
brake_config = BrakeConfig()

# 配置参数
CONFIG_PARAMS = {
    'test_timeout': 30,  # 测试超时时间（秒）
    'retry_count': 3,     # 重试次数
    'log_level': 'INFO'    # 日志级别
}

# 测试环境配置
TEST_ENV = {
    'vehicle_id': 'TEST-1234',
    'test_type': 'FUNCTIONAL',
    'environment': 'LAB'
}`,
    'utils.py': `# -*- coding: utf-8 -*-
"""
工具函数
Utility Module
"""

import time
import logging
from config import CONFIG_PARAMS


# 配置日志
logging.basicConfig(
    level=getattr(logging, CONFIG_PARAMS['log_level']),
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


def log_result(test_name, result):
    """
    记录测试结果
    
    Args:
        test_name (str): 测试名称
        result (bool): 测试结果
    """
    if result:
        logger.info(f"✅ {test_name}: PASSED")
        print(f"✅ {test_name}: PASSED")
    else:
        logger.error(f"❌ {test_name}: FAILED")
        print(f"❌ {test_name}: FAILED")


def check_signal(signal_name, expected_value, tolerance=0.05):
    """
    检查信号值
    
    Args:
        signal_name (str): 信号名称
        expected_value (float): 期望的值
        tolerance (float): 容差范围
    
    Returns:
        bool: 检查结果
    """
    # 模拟获取信号值
    # 在实际应用中，这里会从ECU或其他设备获取真实的信号值
    actual_value = expected_value * (1 + (tolerance * (0.5 - 1)))
    
    # 检查信号值是否在容差范围内
    min_value = expected_value * (1 - tolerance)
    max_value = expected_value * (1 + tolerance)
    
    result = min_value <= actual_value <= max_value
    
    if result:
        logger.info(f"Signal {signal_name}: {actual_value} (expected: {expected_value} ± {tolerance*100}%) - OK")
    else:
        logger.warning(f"Signal {signal_name}: {actual_value} (expected: {expected_value} ± {tolerance*100}%) - OUT OF RANGE")
    
    return result


def retry_operation(operation, max_attempts=CONFIG_PARAMS['retry_count'], delay=1):
    """
    重试操作
    
    Args:
        operation (callable): 要执行的操作
        max_attempts (int): 最大尝试次数
        delay (int): 重试间隔（秒）
    
    Returns:
        Any: 操作结果
    """
    attempts = 0
    while attempts < max_attempts:
        try:
            result = operation()
            if result:
                return result
        except Exception as e:
            logger.error(f"Operation failed: {e}")
        
        attempts += 1
        if attempts < max_attempts:
            logger.info(f"Retrying in {delay} seconds...")
            time.sleep(delay)
    
    logger.error(f"Operation failed after {max_attempts} attempts")
    return False


def measure_time(operation):
    """
    测量操作执行时间
    
    Args:
        operation (callable): 要执行的操作
    
    Returns:
        tuple: (操作结果, 执行时间)
    """
    start_time = time.time()
    result = operation()
    end_time = time.time()
    execution_time = end_time - start_time
    
    logger.info(f"Operation executed in {execution_time:.2f} seconds")
    print(f"Execution time: {execution_time:.2f} seconds")
    
    return result, execution_time


def validate_input(value, expected_type, min_value=None, max_value=None):
    """
    验证输入值
    
    Args:
        value: 输入值
        expected_type: 期望的类型
        min_value: 最小值（可选）
        max_value: 最大值（可选）
    
    Returns:
        bool: 验证结果
    """
    # 检查类型
    if not isinstance(value, expected_type):
        logger.error(f"Invalid type: expected {expected_type.__name__}, got {type(value).__name__}")
        return False
    
    # 检查最小值
    if min_value is not None and value < min_value:
        logger.error(f"Value {value} is less than minimum {min_value}")
        return False
    
    # 检查最大值
    if max_value is not None and value > max_value:
        logger.error(f"Value {value} is greater than maximum {max_value}")
        return False
    
    return True


def format_test_result(test_name, result, execution_time=None, details=None):
    """
    格式化测试结果
    
    Args:
        test_name (str): 测试名称
        result (bool): 测试结果
        execution_time (float): 执行时间（可选）
        details (dict): 详细信息（可选）
    
    Returns:
        dict: 格式化的测试结果
    """
    test_result = {
        'test_name': test_name,
        'result': 'PASSED' if result else 'FAILED',
        'timestamp': time.strftime('%Y-%m-%d %H:%M:%S')
    }
    
    if execution_time is not None:
        test_result['execution_time'] = f"{execution_time:.2f}s"
    
    if details is not None:
        test_result['details'] = details
    
    return test_result


def generate_test_report(test_results):
    """
    生成测试报告
    
    Args:
        test_results (list): 测试结果列表
    
    Returns:
        str: 测试报告
    """
    report = f"Test Report - {time.strftime('%Y-%m-%d %H:%M:%S')}\n"
    report += "=" * 60 + "\n"
    
    passed_count = 0
    failed_count = 0
    
    for result in test_results:
        status = "✅ PASSED" if result['result'] == 'PASSED' else "❌ FAILED"
        report += f"{result['test_name']}: {status}"
        if 'execution_time' in result:
            report += f" (Time: {result['execution_time']})"
        report += "\n"
        
        if result['result'] == 'PASSED':
            passed_count += 1
        else:
            failed_count += 1
    
    report += "=" * 60 + "\n"
    report += f"Summary: {passed_count} passed, {failed_count} failed\n"
    report += f"Total: {len(test_results)} tests\n"
    
    return report


# 全局信号数据库
_signal_db = {}

def set_signal(signal_name, value):
    """
    设置信号值
    
    Args:
        signal_name (str): 信号名称
        value: 信号值
    """
    _signal_db[signal_name] = value
    print(f"Signal {signal_name} set to {value}")


def get_signal(signal_name, default=None):
    """
    获取信号值
    
    Args:
        signal_name (str): 信号名称
        default: 默认值（可选）
    
    Returns:
        Any: 信号值或默认值
    """
    return _signal_db.get(signal_name, default)


def clear_signals():
    """
    清空信号数据库
    """
    _signal_db.clear()
    print("Signal database cleared")
`
};

// 显示脚本结果页面的进度条
function showScriptProgressBar() {
    // 获取进度条元素
    const progressBar = document.getElementById('scriptProgressBar');
    const progressPercentage = document.getElementById('scriptProgressPercentage');
    const progressSection = document.querySelector('.script-progress-section');
    
    if (!progressBar || !progressPercentage || !progressSection) return;
    
    // 显示进度条区域
    progressSection.style.display = 'block';
    
    // 重置进度条
    progressBar.style.width = '0%';
    progressPercentage.textContent = '0%';
    
    // 动画持续时间：5秒
    const duration = 5000;
    const startTime = Date.now();
    
    // 动画函数
    function animateProgress() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const percentage = Math.round(progress * 100);
        
        // 更新进度条
        progressBar.style.width = percentage + '%';
        progressPercentage.textContent = percentage + '%';
        
        // 继续动画
        if (progress < 1) {
            requestAnimationFrame(animateProgress);
        } else {
            // 动画完成，隐藏进度条，显示脚本文件列表和按钮
            setTimeout(function() {
                if (progressSection) {
                    progressSection.style.display = 'none';
                }
                const scriptFileList = document.getElementById('scriptFileList');
                const downloadAllBtn = document.getElementById('downloadAllBtn');
                const finishBtn = document.getElementById('finishBtn');
                if (scriptFileList) {
                    scriptFileList.style.display = 'block';
                }
                if (downloadAllBtn) {
                    downloadAllBtn.style.display = 'inline-block';
                }
                if (finishBtn) {
                    finishBtn.style.display = 'inline-block';
                }
            }, 500);
        }
    }
    
    // 开始动画
    requestAnimationFrame(animateProgress);
}

// 初始化文件上传功能
function initFileUpload() {
    const uploadArea = document.getElementById('uploadArea');
    const uploadButton = document.getElementById('uploadButton');
    const fileInput = document.getElementById('fileInput');
    const fileListBody = document.getElementById('fileListBody');
    
    // 点击上传按钮
    uploadButton.addEventListener('click', function() {
        fileInput.click();
    });
    
    // 点击上传区域
    uploadArea.addEventListener('click', function() {
        fileInput.click();
    });
    
    // 文件选择
    fileInput.addEventListener('change', function(e) {
        const files = e.target.files;
        if (files.length > 0) {
            handleFiles(files);
        }
    });
    
    // 拖拽功能
    uploadArea.addEventListener('dragover', function(e) {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });
    
    uploadArea.addEventListener('dragleave', function() {
        uploadArea.classList.remove('dragover');
    });
    
    uploadArea.addEventListener('drop', function(e) {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFiles(files);
        }
    });
    
    // 处理文件上传
    function handleFiles(files) {
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const fileType = getFileType(file.name);
            
            // 验证文件类型
            if (!isSupportedFileType(fileType)) {
                alert('不支持的文件类型！支持的类型：DBC / LDF / ARXML / CDD / PDX');
                continue;
            }
            
            // 添加到文件列表
            addFileToTable(file, fileType);
            
            // 模拟文件解析过程
            simulateFileParsing(file.name);
        }
    }
    
    // 添加文件到表格
    function addFileToTable(file, fileType) {
        const now = new Date();
        const uploadTime = now.toLocaleString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${file.name}</td>
            <td>${fileType}</td>
            <td>${uploadTime}</td>
            <td><span class="status-badge uploading">Uploading</span></td>
            <td>--</td>
            <td>--</td>
            <td>--</td>
            <td>
                <button class="action-button view" disabled>View</button>
                <button class="action-button delete">Delete</button>
            </td>
        `;
        
        fileListBody.appendChild(row);
    }
    
    // 模拟文件解析过程
    function simulateFileParsing(fileName) {
        const rows = fileListBody.querySelectorAll('tr');
        let targetRow = null;
        
        // 找到对应的行
        for (let row of rows) {
            if (row.querySelector('td:first-child').textContent === fileName) {
                targetRow = row;
                break;
            }
        }
        
        if (!targetRow) return;
        
        // 模拟上传中状态
        setTimeout(() => {
            targetRow.querySelector('.status-badge').className = 'status-badge parsing';
            targetRow.querySelector('.status-badge').textContent = 'Parsing';
            
            // 模拟解析完成
            setTimeout(() => {
                targetRow.querySelector('.status-badge').className = 'status-badge parsed';
                targetRow.querySelector('.status-badge').textContent = 'Parsed';
                
                // 随机生成解析结果
                const messageCount = Math.floor(Math.random() * 100) + 50;
                const signalCount = Math.floor(Math.random() * 200) + 100;
                const nodeCount = Math.floor(Math.random() * 10) + 2;
                
                targetRow.querySelectorAll('td')[4].textContent = messageCount;
                targetRow.querySelectorAll('td')[5].textContent = signalCount;
                targetRow.querySelectorAll('td')[6].textContent = nodeCount;
                
                // 启用查看按钮
                targetRow.querySelector('.action-button.view').disabled = false;
            }, 2000);
        }, 1000);
    }
    
    // 获取文件类型
    function getFileType(fileName) {
        const extension = fileName.split('.').pop().toUpperCase();
        return extension;
    }
    
    // 检查是否支持的文件类型
    function isSupportedFileType(fileType) {
        const supportedTypes = ['DBC', 'LDF', 'ARXML', 'CDD', 'PDX'];
        return supportedTypes.includes(fileType);
    }
}

// 初始化树节点功能
function initTreeNodes() {
    const treeToggles = document.querySelectorAll('.tree-node-toggle');
    
    treeToggles.forEach(toggle => {
        toggle.addEventListener('click', function() {
            const parentNode = this.closest('.tree-node');
            const children = parentNode.querySelector('.tree-children');
            
            if (children) {
                if (children.style.display === 'none') {
                    children.style.display = 'block';
                    this.textContent = '▼';
                } else {
                    children.style.display = 'none';
                    this.textContent = '▶';
                }
            }
        });
    });
    
    // 树节点点击事件
    const treeLabels = document.querySelectorAll('.tree-node-label');
    treeLabels.forEach(label => {
        label.addEventListener('click', function() {
            // 显示节点详情
            showNodeDetails(this.textContent);
        });
    });
}

// 显示节点详情
function showNodeDetails(nodeName) {
    const detailContent = document.querySelector('.detail-content');
    
    // 根据节点类型显示不同的详情
    let detailsHTML = '';
    
    if (nodeName === 'Nodes') {
        detailsHTML = `
            <div class="detail-table">
                <h4>Nodes Information</h4>
                <table class="detail-info-table">
                    <tr>
                        <th>Node Name</th>
                        <th>Description</th>
                        <th>Protocol</th>
                    </tr>
                    <tr>
                        <td>BCM</td>
                        <td>Body Control Module</td>
                        <td>CAN</td>
                    </tr>
                    <tr>
                        <td>EngineECU</td>
                        <td>Engine Control Unit</td>
                        <td>CAN</td>
                    </tr>
                    <tr>
                        <td>Gateway</td>
                        <td>Network Gateway</td>
                        <td>CAN/LIN</td>
                    </tr>
                </table>
            </div>
        `;
    } else if (nodeName === 'Messages') {
        detailsHTML = `
            <div class="detail-table">
                <h4>Messages Information</h4>
                <table class="detail-info-table">
                    <tr>
                        <th>Message Name</th>
                        <th>ID</th>
                        <th>Length</th>
                        <th>Period</th>
                    </tr>
                    <tr>
                        <td>EngineStatus</td>
                        <td>0x123</td>
                        <td>8 bytes</td>
                        <td>100ms</td>
                    </tr>
                    <tr>
                        <td>SpeedInfo</td>
                        <td>0x456</td>
                        <td>4 bytes</td>
                        <td>200ms</td>
                    </tr>
                </table>
            </div>
        `;
    } else if (nodeName === 'Signals') {
        detailsHTML = `
            <div class="detail-table">
                <h4>Signals Information</h4>
                <table class="detail-info-table">
                    <tr>
                        <th>Signal Name</th>
                        <th>Start Bit</th>
                        <th>Length</th>
                        <th>Min</th>
                        <th>Max</th>
                        <th>Unit</th>
                    </tr>
                    <tr>
                        <td>EngineRPM</td>
                        <td>0</td>
                        <td>16</td>
                        <td>0</td>
                        <td>8000</td>
                        <td>rpm</td>
                    </tr>
                    <tr>
                        <td>EngineTemp</td>
                        <td>16</td>
                        <td>8</td>
                        <td>-40</td>
                        <td>125</td>
                        <td>°C</td>
                    </tr>
                    <tr>
                        <td>VehicleSpeed</td>
                        <td>0</td>
                        <td>16</td>
                        <td>0</td>
                        <td>255</td>
                        <td>km/h</td>
                    </tr>
                </table>
            </div>
        `;
    } else if (nodeName === 'Diagnostics') {
        detailsHTML = `
            <div class="detail-table">
                <h4>Diagnostics Information</h4>
                <table class="detail-info-table">
                    <tr>
                        <th>Service</th>
                        <th>Description</th>
                        <th>Sub-Functions</th>
                    </tr>
                    <tr>
                        <td>SessionControl</td>
                        <td>Diagnostic Session Control</td>
                        <td>Default, Extended, Programming</td>
                    </tr>
                    <tr>
                        <td>ReadData</td>
                        <td>Read Data By Identifier</td>
                        <td>Multiple identifiers</td>
                    </tr>
                </table>
            </div>
        `;
    } else {
        detailsHTML = `
            <div class="detail-info">
                <h4>${nodeName}</h4>
                <p>Details for ${nodeName} will be displayed here.</p>
            </div>
        `;
    }
    
    detailContent.innerHTML = detailsHTML;
    
    // 添加详情表格样式
    const style = document.createElement('style');
    style.textContent = `
        .detail-table h4 {
            margin-bottom: 16px;
            color: #333;
        }
        .detail-info-table {
            width: 100%;
            border-collapse: collapse;
        }
        .detail-info-table th,
        .detail-info-table td {
            padding: 8px 12px;
            text-align: left;
            border-bottom: 1px solid #f0f0f0;
        }
        .detail-info-table th {
            background-color: #fafafa;
            font-weight: 600;
            font-size: 14px;
        }
        .detail-info-table td {
            font-size: 14px;
            color: #666;
        }
        .detail-info h4 {
            margin-bottom: 16px;
            color: #333;
        }
        .detail-info p {
            color: #666;
            line-height: 1.5;
        }
    `;
    document.head.appendChild(style);
}

// 初始化标签页功能
function initTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // 移除所有标签页的激活状态
            tabButtons.forEach(btn => btn.classList.remove('active'));
            
            // 激活当前标签页
            this.classList.add('active');
            
            // 这里可以添加标签页内容切换逻辑
            const tabName = this.textContent;
            updateTabContent(tabName);
        });
    });
}

// 更新标签页内容
function updateTabContent(tabName) {
    const detailContent = document.querySelector('.detail-content');
    
    let contentHTML = '';
    
    if (tabName === 'Nodes') {
        contentHTML = `
            <div class="detail-table">
                <h4>Nodes Information</h4>
                <table class="detail-info-table">
                    <tr>
                        <th>Node Name</th>
                        <th>Description</th>
                        <th>Protocol</th>
                    </tr>
                    <tr>
                        <td>BCM</td>
                        <td>Body Control Module</td>
                        <td>CAN</td>
                    </tr>
                    <tr>
                        <td>EngineECU</td>
                        <td>Engine Control Unit</td>
                        <td>CAN</td>
                    </tr>
                    <tr>
                        <td>Gateway</td>
                        <td>Network Gateway</td>
                        <td>CAN/LIN</td>
                    </tr>
                </table>
            </div>
        `;
    } else if (tabName === 'MessagesDetail') {
        contentHTML = `
            <div class="detail-table">
                <h4>Messages Details</h4>
                <table class="detail-info-table">
                    <tr>
                        <th>Message Name</th>
                        <th>ID</th>
                        <th>Length</th>
                        <th>Period</th>
                        <th>Transmitter</th>
                    </tr>
                    <tr>
                        <td>EngineStatus</td>
                        <td>0x123</td>
                        <td>8 bytes</td>
                        <td>100ms</td>
                        <td>EngineECU</td>
                    </tr>
                    <tr>
                        <td>SpeedInfo</td>
                        <td>0x456</td>
                        <td>4 bytes</td>
                        <td>200ms</td>
                        <td>EngineECU</td>
                    </tr>
                </table>
            </div>
        `;
    } else if (tabName === 'Diagnostics') {
        contentHTML = `
            <div class="detail-table">
                <h4>Diagnostic Services</h4>
                <table class="detail-info-table">
                    <tr>
                        <th>Service ID</th>
                        <th>Service Name</th>
                        <th>Description</th>
                    </tr>
                    <tr>
                        <td>0x10</td>
                        <td>SessionControl</td>
                        <td>Diagnostic Session Control</td>
                    </tr>
                    <tr>
                        <td>0x22</td>
                        <td>ReadData</td>
                        <td>Read Data By Identifier</td>
                    </tr>
                    <tr>
                        <td>0x2E</td>
                        <td>WriteData</td>
                        <td>Write Data By Identifier</td>
                    </tr>
                </table>
            </div>
        `;
    }
    
    detailContent.innerHTML = contentHTML;
}

// 初始化操作按钮功能
function initActionButtons() {
    const fileListBody = document.getElementById('fileListBody');
    
    // 委托事件处理
    fileListBody.addEventListener('click', function(e) {
        if (e.target.classList.contains('action-button')) {
            const button = e.target;
            const row = button.closest('tr');
            const fileName = row.querySelector('td:first-child').textContent;
            
            if (button.classList.contains('view')) {
                // 查看文件详情
                alert(`Viewing details for: ${fileName}`);
            } else if (button.classList.contains('delete')) {
                // 删除文件
                if (confirm(`Are you sure you want to delete ${fileName}?`)) {
                    row.remove();
                }
            }
        }
    });
}

// 初始化项目管理功能
function initProjectManagement() {
    const newProjectBtn = document.getElementById('newProjectBtn');
    const projectSearchInput = document.getElementById('projectSearchInput');
    const projectListBody = document.getElementById('projectListBody');
    
    // 新建项目按钮
    if (newProjectBtn) {
        newProjectBtn.addEventListener('click', function() {
            alert('新建项目功能');
        });
    }
    
    // 搜索功能
    if (projectSearchInput) {
        projectSearchInput.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            const rows = projectListBody.querySelectorAll('tr');
            
            rows.forEach(function(row) {
                const projectName = row.querySelector('td:nth-child(2)').textContent.toLowerCase();
                if (projectName.includes(searchTerm)) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        });
    }
    
    // 项目列表操作按钮
    if (projectListBody) {
        // 行点击选择功能
        projectListBody.addEventListener('click', function(e) {
            const target = e.target;
            
            // 如果点击的是操作按钮，不触发行选择
            if (target.classList.contains('action-button-small') || target.classList.contains('expand-icon')) {
                return;
            }
            
            // 行选择功能
            const row = target.closest('tr');
            if (row) {
                // 移除其他行的选中状态
                const allRows = projectListBody.querySelectorAll('tr');
                allRows.forEach(function(r) {
                    r.classList.remove('selected');
                });
                
                // 添加当前行的选中状态
                row.classList.add('selected');
            }
        });
        
        // 操作按钮事件
        projectListBody.addEventListener('click', function(e) {
            const target = e.target;
            
            if (target.classList.contains('expand-icon')) {
                // 展开/折叠项目
                const icon = target;
                if (icon.textContent === '▶') {
                    icon.textContent = '▼';
                } else {
                    icon.textContent = '▶';
                }
            } else if (target.classList.contains('action-button-small')) {
                const row = target.closest('tr');
                const projectName = row.querySelector('td:nth-child(2)').textContent;
                
                if (target.classList.contains('enter')) {
                    // 进入项目 - 跳转到项目详情页面
                    const projectDetailLink = document.querySelector('.sub-menu-link[data-page="project-detail"]');
                    if (projectDetailLink) {
                        // 移除所有子菜单项的激活状态
                        const subMenuLinks = document.querySelectorAll('.sub-menu-link');
                        subMenuLinks.forEach(function(item) {
                            item.closest('.sub-menu-item').classList.remove('active');
                        });
                        
                        // 激活项目详情菜单项
                        projectDetailLink.closest('.sub-menu-item').classList.add('active');
                        
                        // 更新项目详情页面的项目名称
                        const projectNameElement = document.getElementById('projectName');
                        if (projectNameElement) {
                            projectNameElement.textContent = projectName;
                        }
                        
                        // 更新项目详情页面的标题
                        const projectDetailTitle = document.getElementById('projectDetailTitle');
                        if (projectDetailTitle) {
                            projectDetailTitle.textContent = '项目详情 - ' + projectName;
                        }
                        
                        // 切换到项目详情页面
                        switchPage('project-detail');
                    }
                } else if (target.classList.contains('edit')) {
                    // 编辑项目
                    alert(`编辑项目: ${projectName}`);
                } else if (target.classList.contains('delete')) {
                    // 删除项目
                    if (confirm(`确定要删除项目 "${projectName}" 吗？`)) {
                        row.remove();
                    }
                }
            }
        });
    }
}

// 初始化实验设置功能
function initExperimentSetup() {
    const testcaseUploadBtn = document.getElementById('testcaseUploadBtn');
    const testcaseFileInput = document.getElementById('testcaseFileInput');
    const testcaseStatus = document.getElementById('testcaseStatus');
    
    const dbcUploadBtn = document.getElementById('dbcUploadBtn');
    const dbcFileInput = document.getElementById('dbcFileInput');
    const dbcStatus = document.getElementById('dbcStatus');
    
    const otherUploadBtn = document.getElementById('otherUploadBtn');
    const otherFileInput = document.getElementById('otherFileInput');
    const otherStatus = document.getElementById('otherStatus');
    
    const nextButton = document.getElementById('nextButton');
    const functionPointSidebar = document.getElementById('functionPointSidebar');
    const testcasePreviewBody = document.getElementById('testcasePreviewBody');
    
    // 功能点侧边栏点击事件
    if (functionPointSidebar) {
        functionPointSidebar.addEventListener('click', function(e) {
            const item = e.target.closest('.function-point-sidebar-item');
            if (!item) return;
            
            // 如果点击的是复选框，只处理复选框逻辑
                if (e.target.classList.contains('function-point-checkbox')) {
                    const checkbox = e.target;
                    const functionName = item.getAttribute('data-function');
                    
                    // 检查是否超过3个勾选限制
                    if (checkbox.checked) {
                        const allCheckboxes = functionPointSidebar.querySelectorAll('.function-point-checkbox');
                        let checkedCount = 0;
                        allCheckboxes.forEach(function(cb) {
                            if (cb.checked && cb !== checkbox) {
                                checkedCount++;
                            }
                        });
                        
                        if (checkedCount >= 3) {
                            checkbox.checked = false;
                            return;
                        }
                    }
                    
                    // 根据复选框状态更新测试用例
                    updateTestCasesByFunction(functionName, checkbox.checked);
                    
                    // 更新功能点禁用状态
                    updateFunctionPointsDisabledState();
                    return;
                }
            
            // 移除所有功能点的激活状态
            const allPoints = functionPointSidebar.querySelectorAll('.function-point-sidebar-item');
            allPoints.forEach(function(p) {
                p.classList.remove('active');
            });
            
            // 激活当前功能点
            item.classList.add('active');
            
            // 获取选择的功能点
            const selectedFunction = item.getAttribute('data-function');
            
            // 过滤测试用例（不自动勾选）
            filterTestCases(selectedFunction);
            
            console.log('选择的功能点:', selectedFunction);
        });
    }
    
    // 根据功能点更新测试用例复选框状态
    function updateTestCasesByFunction(functionName, isChecked) {
        if (!testcasePreviewBody) return;
        
        const rows = testcasePreviewBody.querySelectorAll('tr');
        rows.forEach(function(row) {
            const functionCell = row.querySelector('td:nth-child(4)');
            const checkbox = row.querySelector('.function-checkbox');
            
            if (functionCell && checkbox) {
                const rowFunctionName = functionCell.textContent.trim();
                
                if (rowFunctionName === functionName) {
                    checkbox.checked = isChecked;
                }
            }
        });
    }
    
    // 测试用例复选框点击事件
    if (testcasePreviewBody) {
        testcasePreviewBody.addEventListener('change', function(e) {
            if (e.target.classList.contains('function-checkbox')) {
                const row = e.target.closest('tr');
                if (!row) return;
                
                const functionCell = row.querySelector('td:nth-child(4)');
                if (!functionCell) return;
                
                const functionName = functionCell.textContent.trim();
                const isChecked = e.target.checked;
                
                // 检查是否超过3个勾选限制
                if (isChecked) {
                    const functionPointItem = functionPointSidebar.querySelector(`[data-function="${functionName}"]`);
                if (functionPointItem) {
                    const checkbox = functionPointItem.querySelector('.function-point-checkbox');
                    if (checkbox && !checkbox.checked) {
                        const allCheckboxes = functionPointSidebar.querySelectorAll('.function-point-checkbox');
                        let checkedCount = 0;
                        allCheckboxes.forEach(function(cb) {
                            if (cb.checked && cb !== checkbox) {
                                checkedCount++;
                            }
                        });
                        
                        if (checkedCount >= 3) {
                            e.target.checked = false;
                            return;
                        }
                    }
                }
                }
                
                // 更新对应功能点的复选框状态
                updateFunctionPointCheckbox(functionName, isChecked);
                
                // 更新功能点禁用状态
                updateFunctionPointsDisabledState();
            }
        });
    }
    
    // 更新功能点复选框状态
    function updateFunctionPointCheckbox(functionName, isChecked) {
        if (!functionPointSidebar) return;
        
        const functionPointItem = functionPointSidebar.querySelector(`[data-function="${functionName}"]`);
        if (!functionPointItem) return;
        
        const checkbox = functionPointItem.querySelector('.function-point-checkbox');
        if (checkbox) {
            checkbox.checked = isChecked;
        }
    }
    
    // 获取已勾选的功能点数量
    function getCheckedFunctionPointsCount() {
        if (!functionPointSidebar) return 0;
        
        const checkedCheckboxes = functionPointSidebar.querySelectorAll('.function-point-checkbox:checked');
        let count = 0;
        
        checkedCheckboxes.forEach(function(checkbox) {
            count++;
        });
        
        return count;
    }
    
    // 更新功能点禁用状态
    function updateFunctionPointsDisabledState() {
        if (!functionPointSidebar) return;
        
        const checkedCount = getCheckedFunctionPointsCount();
        const allCheckboxes = functionPointSidebar.querySelectorAll('.function-point-checkbox');
        
        allCheckboxes.forEach(function(checkbox) {
            if (checkedCount >= 3) {
                if (!checkbox.checked) {
                    checkbox.disabled = true;
                    checkbox.closest('.function-point-sidebar-item').classList.add('disabled');
                } else {
                    checkbox.disabled = false;
                    checkbox.closest('.function-point-sidebar-item').classList.remove('disabled');
                }
            } else {
                checkbox.disabled = false;
                checkbox.closest('.function-point-sidebar-item').classList.remove('disabled');
            }
        });
    }
    
    // 过滤测试用例函数
    function filterTestCases(functionName) {
        if (!testcasePreviewBody) return;
        
        const rows = testcasePreviewBody.querySelectorAll('tr');
        rows.forEach(function(row) {
            const functionCell = row.querySelector('td:nth-child(4)');
            
            if (functionCell) {
                const rowFunctionName = functionCell.textContent.trim();
                
                if (rowFunctionName === functionName) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            }
        });
    }
    
    // 测试用例文件上传
    if (testcaseUploadBtn && testcaseFileInput) {
        testcaseUploadBtn.addEventListener('click', function() {
            testcaseFileInput.click();
        });
        
        testcaseFileInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                handleFileUpload(file, testcaseStatus, 'testcase');
            }
        });
    }
    
    // DBC文件上传
    if (dbcUploadBtn && dbcFileInput) {
        dbcUploadBtn.addEventListener('click', function() {
            dbcFileInput.click();
        });
        
        dbcFileInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                handleFileUpload(file, dbcStatus, 'dbc');
            }
        });
    }
    
    // 其他文件上传
    if (otherUploadBtn && otherFileInput) {
        otherUploadBtn.addEventListener('click', function() {
            otherFileInput.click();
        });
        
        otherFileInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                handleFileUpload(file, otherStatus, 'other');
            }
        });
    }
    
    // 下一步按钮
    if (nextButton) {
        nextButton.addEventListener('click', function() {
            // 检查是否已选择功能点
            const functionPointCheckboxes = document.querySelectorAll('.function-point-checkbox:checked');
            if (functionPointCheckboxes.length === 0) {
                alert('请至少选择一个功能点');
                return;
            }
            
            // 获取选中的功能点
            const selectedFunctions = [];
            functionPointCheckboxes.forEach(function(checkbox) {
                const functionName = checkbox.closest('.function-point-sidebar-item').getAttribute('data-function');
                if (functionName === 'all') {
                    // 如果选择了"全部"，则包含所有功能点
                    const allFunctions = functionPointSidebar.querySelectorAll('.function-point-sidebar-item[data-function]');
                    allFunctions.forEach(function(item) {
                        const name = item.getAttribute('data-function');
                        if (name !== 'all' && !selectedFunctions.includes(name)) {
                            selectedFunctions.push(name);
                        }
                    });
                } else {
                    selectedFunctions.push(functionName);
                }
            });
            
            console.log('项目文件管理页面 - 选中的功能点:', selectedFunctions);
            
            // 获取测试对象输入
            const ecuNamesInput = document.getElementById('ecuNames');
            let ecuNames = [];
            if (ecuNamesInput && ecuNamesInput.value.trim()) {
                ecuNames = ecuNamesInput.value.split(',').map(name => name.trim()).filter(name => name);
                console.log('输入的测试对象:', ecuNames);
            }
            
            // 保存选中的功能点到sessionStorage
            sessionStorage.setItem('selectedFunctions', JSON.stringify(selectedFunctions));
            
            // 保存测试对象到sessionStorage
            sessionStorage.setItem('ecuNames', JSON.stringify(ecuNames));
            
            // 将选中的功能点添加到已生成脚本的功能点列表中
            let generatedFunctions = JSON.parse(sessionStorage.getItem('generatedFunctions') || '[]');
            selectedFunctions.forEach(function(func) {
                if (!generatedFunctions.includes(func)) {
                    generatedFunctions.push(func);
                }
            });
            sessionStorage.setItem('generatedFunctions', JSON.stringify(generatedFunctions));
            
            // 切换到逻辑检查页面
            const logicCheckLink = document.querySelector('.sub-menu-link[data-page="logic-check"]');
            if (logicCheckLink) {
                // 移除所有子菜单项的激活状态
                const subMenuLinks = document.querySelectorAll('.sub-menu-link');
                subMenuLinks.forEach(function(item) {
                    item.closest('.sub-menu-item').classList.remove('active');
                });
                
                // 激活逻辑检查菜单项
                logicCheckLink.closest('.sub-menu-item').classList.add('active');
                
                // 获取项目文件管理页面的项目信息
                const currentProjectName = document.getElementById('currentProjectName');
                const currentExperimentName = document.getElementById('currentExperimentName');
                
                // 更新逻辑检查页面的项目信息
                const logicProjectName = document.getElementById('logicProjectName');
                const logicExperimentName = document.getElementById('logicExperimentName');
                
                if (currentProjectName && logicProjectName) {
                    logicProjectName.textContent = currentProjectName.textContent;
                }
                if (currentExperimentName && logicExperimentName) {
                    logicExperimentName.textContent = currentExperimentName.textContent;
                }
                
                // 切换到逻辑检查页面
                switchPage('logic-check');
                
                // 显示进度条并开始动画
                showProgressBar();
            }
        });
    }
    
    // 处理文件上传
    function handleFileUpload(file, statusElement, fileType) {
        // 验证文件类型
        let isValid = false;
        const fileName = file.name.toLowerCase();
        
        switch (fileType) {
            case 'testcase':
                isValid = fileName.endsWith('.xlsx') || fileName.endsWith('.xls');
                break;
            case 'dbc':
                isValid = fileName.endsWith('.dbc');
                break;
            case 'other':
                isValid = fileName.endsWith('.cdd') || fileName.endsWith('.pdx') || fileName.endsWith('.arxml');
                break;
        }
        
        if (!isValid) {
            alert('不支持的文件类型！');
            return;
        }
        
        // 更新状态显示
        statusElement.textContent = file.name;
        statusElement.style.color = '#52c41a';
        
        // 模拟解析过程
        simulateFileParsing(fileType);
    }
    
    // 模拟文件解析过程
    function simulateFileParsing(fileType) {
        const parseStatusText = document.getElementById('parseStatusText');
        const testcaseCount = document.getElementById('testcaseCount');
        const functionCount = document.getElementById('functionCount');
        const signalCount = document.getElementById('signalCount');
        
        // 更新解析状态
        if (parseStatusText) {
            parseStatusText.textContent = '解析中...';
            parseStatusText.style.color = '#1890ff';
        }
        
        // 模拟解析延迟
        setTimeout(function() {
            if (parseStatusText) {
                parseStatusText.textContent = '解析完成';
                parseStatusText.style.color = '#52c41a';
            }
            
            // 更新统计信息（根据文件类型）
            if (fileType === 'testcase') {
                if (testcaseCount) testcaseCount.textContent = '124';
                if (functionCount) functionCount.textContent = '8';
            } else if (fileType === 'dbc') {
                if (signalCount) signalCount.textContent = '680';
            }
        }, 1000);
    }
    
    // 初始化进度指示器
    updateProgressIndicator();
    
    // 初始化功能点禁用状态
    updateFunctionPointsDisabledState();
}

// 初始化项目详情功能
function initProjectDetail() {
    const newExperimentBtn = document.getElementById('newExperimentBtn');
    const experimentListBody = document.getElementById('experimentListBody');
    const newExperimentPanel = document.getElementById('newExperimentPanel');
    const experimentPanelOverlay = document.getElementById('experimentPanelOverlay');
    const closeExperimentPanel = document.getElementById('closeExperimentPanel');
    const cancelNewExperiment = document.getElementById('cancelNewExperiment');
    const confirmNewExperiment = document.getElementById('confirmNewExperiment');
    const experimentNameInput = document.getElementById('experimentName');
    const experimentDescInput = document.getElementById('experimentDesc');
    
    // 打开新建实验面板
    function openPanel() {
        newExperimentPanel.classList.add('show');
        experimentPanelOverlay.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
    
    // 关闭新建实验面板
    function closePanel() {
        newExperimentPanel.classList.remove('show');
        experimentPanelOverlay.classList.remove('show');
        document.body.style.overflow = '';
        experimentNameInput.value = '';
        experimentDescInput.value = '';
    }
    
    // 新建实验按钮 - 移除旧的监听器，添加新的
    if (newExperimentBtn) {
        // 移除旧的监听器
        const newExperimentBtnClone = newExperimentBtn.cloneNode(true);
        newExperimentBtn.parentNode.replaceChild(newExperimentBtnClone, newExperimentBtn);
        
        // 添加新的监听器
        newExperimentBtnClone.addEventListener('click', function() {
            openPanel();
        });
    }
    
    // 关闭按钮 - 移除旧的监听器，添加新的
    if (closeExperimentPanel) {
        const closePanelClone = closeExperimentPanel.cloneNode(true);
        closeExperimentPanel.parentNode.replaceChild(closePanelClone, closeExperimentPanel);
        
        closePanelClone.addEventListener('click', closePanel);
    }
    
    // 取消按钮 - 移除旧的监听器，添加新的
    if (cancelNewExperiment) {
        const cancelClone = cancelNewExperiment.cloneNode(true);
        cancelNewExperiment.parentNode.replaceChild(cancelClone, cancelNewExperiment);
        
        cancelClone.addEventListener('click', closePanel);
    }
    
    // 点击遮罩层关闭 - 移除旧的监听器，添加新的
    if (experimentPanelOverlay) {
        const overlayClone = experimentPanelOverlay.cloneNode(true);
        experimentPanelOverlay.parentNode.replaceChild(overlayClone, experimentPanelOverlay);
        
        overlayClone.addEventListener('click', closePanel);
    }
    
    // 创建实验 - 移除旧的监听器，添加新的
    if (confirmNewExperiment) {
        const confirmClone = confirmNewExperiment.cloneNode(true);
        confirmNewExperiment.parentNode.replaceChild(confirmClone, confirmNewExperiment);
        
        confirmClone.addEventListener('click', function() {
            const experimentName = experimentNameInput.value.trim();
            
            if (!experimentName) {
                alert('请输入实验名称');
                return;
            }
            
            const experimentDesc = experimentDescInput.value.trim();
            
            // 创建新的实验行
            const newRow = document.createElement('tr');
            const now = new Date();
            const timestamp = now.getFullYear() + '-' + 
                            String(now.getMonth() + 1).padStart(2, '0') + '-' + 
                            String(now.getDate()).padStart(2, '0') + ' ' + 
                            String(now.getHours()).padStart(2, '0') + ':' + 
                            String(now.getMinutes()).padStart(2, '0');
            
            newRow.setAttribute('data-experiment-name', experimentName);
            newRow.setAttribute('data-experiment-desc', experimentDesc);
            
            newRow.innerHTML = `
                <td>
                    <div class="experiment-name">${experimentName}</div>
                    <div class="experiment-version">第${experimentListBody.children.length + 1}次</div>
                </td>
                <td>${timestamp}</td>
                <td>
                    <div class="file-list">
                        <div class="file-item" style="color: #999;">暂无文件</div>
                    </div>
                </td>
                <td>
                    <button class="action-button-small view-result" disabled style="opacity: 0.5;">查看结果</button>
                </td>
                <td>
                    <button class="action-button-small enter-experiment">进入</button>
                    <button class="action-button-small delete-experiment">删除</button>
                </td>
            `;
            
            experimentListBody.insertBefore(newRow, experimentListBody.firstChild);
            
            // 关闭面板
            closePanel();
            
            alert('实验创建成功！');
        });
    }
    
    // 实验列表操作按钮 - 移除旧的监听器，添加新的
    if (experimentListBody) {
        // 移除旧的监听器
        const experimentListBodyClone = experimentListBody.cloneNode(true);
        experimentListBody.parentNode.replaceChild(experimentListBodyClone, experimentListBody);
        
        // 添加新的监听器
        experimentListBodyClone.addEventListener('click', function(e) {
            const target = e.target;
            
            if (target.classList.contains('view-result')) {
                // 查看结果
                const row = target.closest('tr');
                const experimentName = row.querySelector('.experiment-name').textContent;
                alert('查看结果: ' + experimentName);
            } else if (target.classList.contains('enter-experiment')) {
                // 进入实验
                const row = target.closest('tr');
                const experimentName = row.getAttribute('data-experiment-name');
                const experimentDesc = row.getAttribute('data-experiment-desc') || '暂无描述';
                const projectName = document.getElementById('projectName').textContent;
                
                // 跳转到项目文件管理页面
                const fileManagementLink = document.querySelector('.sub-menu-link[data-page="experiment-setup"]');
                if (fileManagementLink) {
                    // 移除所有子菜单项的激活状态
                    const subMenuLinks = document.querySelectorAll('.sub-menu-link');
                    subMenuLinks.forEach(function(item) {
                        item.closest('.sub-menu-item').classList.remove('active');
                    });
                    
                    // 激活项目文件管理菜单项
                    fileManagementLink.closest('.sub-menu-item').classList.add('active');
                    
                    // 更新项目文件管理页面的信息
                    const currentProjectName = document.getElementById('currentProjectName');
                    const currentExperimentName = document.getElementById('currentExperimentName');
                    const currentExperimentDesc = document.getElementById('currentExperimentDesc');
                    
                    if (currentProjectName) {
                        currentProjectName.textContent = '项目：' + projectName;
                    }
                    if (currentExperimentName) {
                        currentExperimentName.textContent = experimentName;
                    }
                    if (currentExperimentDesc) {
                        currentExperimentDesc.textContent = experimentDesc;
                    }
                    
                    // 切换到项目文件管理页面
                    switchPage('experiment-setup');
                }
            } else if (target.classList.contains('delete-experiment')) {
                // 删除实验
                const row = target.closest('tr');
                const experimentName = row.querySelector('.experiment-name').textContent;
                
                if (confirm('确定要删除实验 "' + experimentName + '" 吗？')) {
                    row.remove();
                }
            }
        });
    }
    
    // 初始化进度指示器
    updateProgressIndicator();
}

// 文件操作功能
function initFileActions() {
    const fileActions = document.querySelectorAll('.file-actions');
    
    fileActions.forEach(function(actions) {
        actions.addEventListener('click', function(e) {
            const target = e.target;
            
            if (target.classList.contains('edit-file')) {
                // 编辑文件
                const fileStatus = actions.previousElementSibling;
                const fileName = fileStatus.textContent.replace(' ✔', '');
                alert('编辑文件: ' + fileName);
            } else if (target.classList.contains('delete-file')) {
                // 删除文件
                const fileStatus = actions.previousElementSibling;
                const fileName = fileStatus.textContent.replace(' ✔', '');
                
                if (confirm('确定要删除文件 "' + fileName + '" 吗？')) {
                    fileStatus.textContent = '未上传';
                    fileStatus.style.color = '#999';
                    fileStatus.style.fontStyle = 'italic';
                    
                    // 重置对应的文件输入
                    const fileInput = fileStatus.previousElementSibling;
                    if (fileInput && fileInput.type === 'file') {
                        fileInput.value = '';
                    }
                }
            }
        });
    });
}

// 初始化脚本结果功能
function initScriptResult() {
    if (window.scriptResultInitialized) {
        return;
    }
    
    const scriptFunctionPointSidebar = document.getElementById('scriptFunctionPointSidebar');
    
    // 所有功能点数据
    const allFunctionPoints = [
        { name: '验证发动机启动功能', file: 'test_engine.py' },
        { name: '验证ABS制动系统', file: 'test_abs.py' },
        { name: '验证变速箱换挡功能', file: 'test_transmission.py' },
        { name: '验证制动系统性能', file: 'test_brake.py' },
        { name: '验证发动机停止功能', file: 'test_engine.py' }
    ];
    
    // 从sessionStorage获取选中的功能点
    const selectedFunctions = JSON.parse(sessionStorage.getItem('selectedFunctions') || '[]');
    
    // 更新"本次勾选功能点-功能点"列表
    function updateSelectedFunctionPoints() {
        if (!scriptFunctionPointSidebar) return;
        
        // 清空列表
        scriptFunctionPointSidebar.innerHTML = '';
        
        // 添加选中的功能点
        allFunctionPoints.forEach(function(functionPoint) {
            const item = document.createElement('div');
            item.className = 'function-point-sidebar-item';
            item.setAttribute('data-function', functionPoint.name);
            item.style.cursor = 'default'; // 设为默认光标，看起来不可点击
            
            // 检查功能点是否被选中
            const isSelected = selectedFunctions.includes(functionPoint.name);
            
            if (isSelected) {
                // 选中的功能点显示
                item.innerHTML = '<span class="point-name">' + functionPoint.name + '</span>';
            } else {
                // 未选中的功能点不显示
                item.style.display = 'none';
            }
            
            scriptFunctionPointSidebar.appendChild(item);
        });
    }
    
    // 初始化时更新一次列表
    updateSelectedFunctionPoints();
    
    // 共用文件列表
    const commonFiles = ['config.py', 'utils.py'];
    

    
    // 绑定文件点击事件
    function bindFileClickEvents() {
        const scriptFileList = document.getElementById('scriptFileList');
        const codeBlock = document.getElementById('codeBlock');
        const currentFileName = document.getElementById('currentFileName');
        
        if (scriptFileList && codeBlock && currentFileName) {
            // 移除旧的点击事件
            const oldHandler = scriptFileList.getAttribute('data-click-handler');
            if (oldHandler) {
                scriptFileList.removeEventListener('click', oldHandler);
            }
            
            // 添加新的点击事件
            const clickHandler = function(e) {
                const fileItem = e.target.closest('.script-file-item');
                if (!fileItem) return;
                
                // 移除所有文件的激活状态
                const allFiles = scriptFileList.querySelectorAll('.script-file-item');
                allFiles.forEach(function(item) {
                    item.classList.remove('active');
                });
                
                // 激活当前文件
                fileItem.classList.add('active');
                
                // 获取文件名
                const fileName = fileItem.getAttribute('data-file');
                
                // 更新代码显示
                if (codeFiles[fileName]) {
                    codeBlock.textContent = codeFiles[fileName];
                }
                
                // 更新文件名显示
                currentFileName.textContent = fileName;
            };
            
            scriptFileList.addEventListener('click', clickHandler);
            scriptFileList.setAttribute('data-click-handler', clickHandler);
        }
    }
    
    // 初始化时显示所有文件
    const scriptFileList = document.getElementById('scriptFileList');
    if (scriptFileList) {
        // 清空文件列表
        scriptFileList.innerHTML = '';
        
        // 显示所有文件
        const allFiles = [...new Set([...commonFiles, ...allFunctionPoints.map(fp => fp.file)])];
        allFiles.forEach(function(file) {
            const fileItem = document.createElement('div');
            fileItem.className = 'script-file-item';
            fileItem.setAttribute('data-file', file);
            fileItem.innerHTML = `<span class="file-icon">📄</span><span class="file-name">${file}</span>`;
            scriptFileList.appendChild(fileItem);
        });
        
        // 绑定文件点击事件
        bindFileClickEvents();
    }
    
    // 标记初始化完成
    window.scriptResultInitialized = true;
}

// 初始化脚本评审功能
function initScriptReview() {
    // 如果已经初始化过，直接返回
    if (window.scriptReviewInitialized) {
        return;
    }
    
    const scriptFileList = document.getElementById('scriptFileList');
    const codeBlock = document.getElementById('codeBlock');
    const currentFileName = document.getElementById('currentFileName');
    const scriptEcuNames = document.getElementById('scriptEcuNames');
    
    // 从sessionStorage获取测试对象
    const ecuNames = JSON.parse(sessionStorage.getItem('ecuNames') || '[]');
    
    // 显示测试对象
    if (scriptEcuNames) {
        if (ecuNames.length > 0) {
            scriptEcuNames.textContent = ecuNames.join(', ');
        } else {
            scriptEcuNames.textContent = '未设置';
        }
    }
    
    // 示例代码数据
    const codeFiles = {
        'test_engine.py': `# -*- coding: utf-8 -*-
"""
发动机测试脚本
Test Engine Module
"""

import pytest
import time
from config import EngineConfig
from utils import log_result, check_signal


class TestEngine:
    """发动机功能测试类"""
    
    def setup_method(self):
        """测试前置设置"""
        self.engine = EngineConfig()
        self.engine.initialize()
        print("Engine test setup completed")
    
    def teardown_method(self):
        """测试后置清理"""
        self.engine.shutdown()
        print("Engine test teardown completed")
    
    def test_engine_start(self):
        """测试发动机启动功能"""
        # 步骤1: 检查点火状态
        ignition_status = check_signal("IgnitionStatus")
        assert ignition_status == "ON", "点火状态应为ON"
        
        # 步骤2: 启动发动机
        result = self.engine.start()
        assert result is True, "发动机启动失败"
        
        # 步骤3: 检查发动机转速
        engine_speed = check_signal("EngineSpeed")
        assert engine_speed > 0, "发动机转速应大于0"
        
        # 步骤4: 记录测试结果
        log_result("test_engine_start", "PASS", engine_speed)
        print(f"Engine start test passed. Speed: {engine_speed} RPM")
    
    def test_engine_stop(self):
        """测试发动机停止功能"""
        # 前置条件: 发动机已启动
        self.engine.start()
        time.sleep(1)
        
        # 步骤1: 停止发动机
        result = self.engine.stop()
        assert result is True, "发动机停止失败"
        
        # 步骤2: 检查发动机转速
        engine_speed = check_signal("EngineSpeed")
        assert engine_speed == 0, "发动机转速应为0"
        
        # 步骤3: 记录测试结果
        log_result("test_engine_stop", "PASS", engine_speed)
        print("Engine stop test passed")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "-s"])`,

        'test_abs.py': `# -*- coding: utf-8 -*-
"""
ABS制动系统测试脚本
ABS Brake System Test Module
"""

import pytest
import time
from config import ABSConfig
from utils import log_result, check_signal


class TestABS:
    """ABS制动系统测试类"""
    
    def setup_method(self):
        """测试前置设置"""
        self.abs = ABSConfig()
        self.abs.initialize()
        print("ABS test setup completed")
    
    def teardown_method(self):
        """测试后置清理"""
        self.abs.shutdown()
        print("ABS test teardown completed")
    
    def test_abs_activation(self):
        """测试ABS激活功能"""
        # 步骤1: 检查车速
        vehicle_speed = check_signal("VehicleSpeed")
        assert vehicle_speed > 30, "车速应大于30km/h"
        
        # 步骤2: 紧急制动
        result = self.abs.emergency_brake()
        assert result is True, "紧急制动失败"
        
        # 步骤3: 检查ABS激活状态
        abs_active = check_signal("ABS_Active")
        assert abs_active is True, "ABS应处于激活状态"
        
        # 步骤4: 记录测试结果
        log_result("test_abs_activation", "PASS", abs_active)
        print("ABS activation test passed")
    
    def test_wheel_speed_monitoring(self):
        """测试轮速监测"""
        # 获取四个轮速信号
        wheel_speeds = {
            "FL": check_signal("WheelSpeed_FL"),
            "FR": check_signal("WheelSpeed_FR"),
            "RL": check_signal("WheelSpeed_RL"),
            "RR": check_signal("WheelSpeed_RR")
        }
        
        # 验证所有轮速都在合理范围内
        for position, speed in wheel_speeds.items():
            assert 0 <= speed <= 300, f"{position}轮速异常: {speed} km/h"
        
        log_result("test_wheel_speed_monitoring", "PASS", wheel_speeds)
        print(f"Wheel speed monitoring test passed: {wheel_speeds}")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "-s"])`,

        'test_transmission.py': `# -*- coding: utf-8 -*-
"""
变速箱测试脚本
Transmission Test Module
"""

import pytest
from config import TransmissionConfig
from utils import log_result, check_signal


class TestTransmission:
    """变速箱测试类"""
    
    def setup_method(self):
        """测试前置设置"""
        self.trans = TransmissionConfig()
        self.trans.initialize()
    
    def teardown_method(self):
        """测试后置清理"""
        self.trans.shutdown()
    
    def test_gear_shift(self):
        """测试换挡功能"""
        # 测试所有挡位
        gears = ["P", "R", "N", "D", "L"]
        
        for gear in gears:
            # 切换挡位
            result = self.trans.shift_to(gear)
            assert result is True, f"切换到{gear}挡失败"
            
            # 验证挡位信号
            current_gear = check_signal("GearPosition")
            assert current_gear == gear, f"挡位不匹配: 期望{gear}, 实际{current_gear}"
        
        log_result("test_gear_shift", "PASS")
        print("Gear shift test passed")`,

        'test_brake.py': `# -*- coding: utf-8 -*-
"""
制动系统测试脚本
Brake System Test Module
"""

import pytest
from config import BrakeConfig
from utils import log_result, check_signal


class TestBrake:
    """制动系统测试类"""
    
    def setup_method(self):
        """测试前置设置"""
        self.brake = BrakeConfig()
        self.brake.initialize()
    
    def test_brake_pressure(self):
        """测试制动压力"""
        # 施加制动
        self.brake.apply(50)  # 50% 制动力
        
        # 检查制动压力
        pressure = check_signal("BrakePressure")
        assert 0 < pressure <= 100, f"制动压力异常: {pressure} bar"
        
        log_result("test_brake_pressure", "PASS", pressure)
        print(f"Brake pressure test passed: {pressure} bar")`,

        'config.py': `# -*- coding: utf-8 -*-
"""
配置文件
Configuration Module
"""

class EngineConfig:
    """发动机配置类"""
    
    def __init__(self):
        self.initialized = False
    
    def initialize(self):
        """初始化发动机"""
        self.initialized = True
        print("Engine initialized")
    
    def shutdown(self):
        """关闭发动机"""
        self.initialized = False
        print("Engine shutdown")
    
    def start(self):
        """启动发动机"""
        return True
    
    def stop(self):
        """停止发动机"""
        return True
    
    def set_throttle(self, value):
        """设置节气门开度"""
        print(f"Throttle set to {value}%")


class ABSConfig:
    """ABS配置类"""
    
    def __init__(self):
        self.initialized = False
    
    def initialize(self):
        self.initialized = True
    
    def shutdown(self):
        self.initialized = False
    
    def emergency_brake(self):
        return True


class TransmissionConfig:
    """变速箱配置类"""
    
    def __init__(self):
        self.initialized = False
    
    def initialize(self):
        self.initialized = True
    
    def shutdown(self):
        self.initialized = False
    
    def shift_to(self, gear):
        return True


class BrakeConfig:
    """制动系统配置类"""
    
    def __init__(self):
        self.initialized = False
    
    def initialize(self):
        self.initialized = True
    
    def shutdown(self):
        self.initialized = False
    
    def apply(self, pressure):
        print(f"Brake applied with {pressure}% pressure")`,

        'utils.py': `# -*- coding: utf-8 -*-
"""
工具函数
Utility Functions
"""

import json
from datetime import datetime


# 模拟信号数据库
_signal_db = {
    "EngineSpeed": 2500,
    "EngineTemp": 95,
    "VehicleSpeed": 60,
    "BrakePressure": 0,
    "GearPosition": "D",
    "ABS_Active": False,
    "IgnitionStatus": "ON",
    "CoolantTemp": 92,
    "OilTemp": 85,
    "ThrottlePosition": 30,
    "WheelSpeed_FL": 60,
    "WheelSpeed_FR": 60,
    "WheelSpeed_RL": 60,
    "WheelSpeed_RR": 60
}


def check_signal(signal_name):
    """
    检查信号值
    
    Args:
        signal_name: 信号名称
    
    Returns:
        信号值
    """
    return _signal_db.get(signal_name, 0)


def log_result(test_name, status, data=None):
    """
    记录测试结果
    
    Args:
        test_name: 测试名称
        status: 测试状态 (PASS/FAIL)
        data: 测试数据
    """
    result = {
        "test_name": test_name,
        "status": status,
        "data": data,
        "timestamp": datetime.now().isoformat()
    }
    
    print(f"[LOG] {json.dumps(result, ensure_ascii=False)}")
    
    # 这里可以扩展为写入文件或数据库
    return result


def set_signal(signal_name, value):
    """
    设置信号值
    
    Args:
        signal_name: 信号名称
        value: 信号值
    """
    _signal_db[signal_name] = value
    print(f"Signal {signal_name} set to {value}")`
    };
    
    // 文件点击事件
    if (scriptFileList) {
        scriptFileList.addEventListener('click', function(e) {
            const fileItem = e.target.closest('.script-file-item');
            if (!fileItem) return;
            
            // 移除所有文件的激活状态
            const allFiles = scriptFileList.querySelectorAll('.script-file-item');
            allFiles.forEach(function(item) {
                item.classList.remove('active');
            });
            
            // 激活当前文件
            fileItem.classList.add('active');
            
            // 获取文件名
            const fileName = fileItem.getAttribute('data-file');
            
            // 更新代码显示
            if (codeBlock && codeFiles[fileName]) {
                codeBlock.textContent = codeFiles[fileName];
            }
            
            // 更新文件名显示
            if (currentFileName) {
                currentFileName.textContent = fileName;
            }
            
            console.log('选择的文件:', fileName);
        });
    }
    
    // 复制代码按钮
    const copyBtn = document.querySelector('.code-action-btn[title="复制代码"]');
    if (copyBtn) {
        copyBtn.addEventListener('click', function() {
            if (codeBlock) {
                const code = codeBlock.textContent;
                navigator.clipboard.writeText(code).then(function() {
                    const originalText = copyBtn.textContent;
                    copyBtn.textContent = '✓ 已复制';
                    setTimeout(function() {
                        copyBtn.textContent = originalText;
                    }, 2000);
                });
            }
        });
    }
    
    // 下载文件按钮
    const downloadBtn = document.querySelector('.code-action-btn[title="下载文件"]');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', function() {
            if (codeBlock && currentFileName) {
                const code = codeBlock.textContent;
                const fileName = currentFileName.textContent;
                
                const blob = new Blob([code], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = fileName;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }
        });
    }
    
    // 一键下载全部按钮
    const downloadAllBtn = document.getElementById('downloadAllBtn');
    if (downloadAllBtn) {
        downloadAllBtn.addEventListener('click', function() {
            // 遍历所有文件
            for (const fileName in codeFiles) {
                const code = codeFiles[fileName];
                
                // 创建下载链接
                const blob = new Blob([code], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = fileName;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                
                // 添加延迟避免浏览器阻止多个下载
                setTimeout(function() {}, 200);
            }
        });
    }
    
    // 返回继续选择按钮
    // 结束本次生成按钮
    const finishBtn = document.getElementById('finishBtn');
    if (finishBtn) {
        finishBtn.addEventListener('click', function() {
            // 确认是否结束本次生成
            if (confirm('确定要结束本次生成吗？所有生成进度将被清除。')) {
                // 清除所有生成相关的数据
                sessionStorage.removeItem('selectedFunctions');
                sessionStorage.removeItem('ecuNames');
                sessionStorage.removeItem('generatedFunctions');
                
                // 跳转到项目管理页面
                const projectManagementLink = document.querySelector('.sub-menu-link[data-page="script-project"]');
                if (projectManagementLink) {
                    // 移除所有子菜单项的激活状态
                    const subMenuLinks = document.querySelectorAll('.sub-menu-link');
                    subMenuLinks.forEach(function(item) {
                        item.closest('.sub-menu-item').classList.remove('active');
                    });
                    
                    // 激活项目管理菜单项
                    projectManagementLink.closest('.sub-menu-item').classList.add('active');
                    
                    // 切换到项目管理页面
                    switchPage('script-project');
                    
                    // 刷新页面状态，重置功能点到未生成状态
                    resetFunctionPoints();
                }
            }
        });
    }
    
    // 标记初始化完成
    window.scriptReviewInitialized = true;
}

// 初始化逻辑检查页面
function initLogicCheck() {
    const logicProjectName = document.getElementById('logicProjectName');
    const logicExperimentName = document.getElementById('logicExperimentName');
    const logicEcuNames = document.getElementById('logicEcuNames');
    const functionPointTabs = document.getElementById('functionPointTabs');
    const aiGeneratedCode = document.getElementById('aiGeneratedCode');
    const originalCode = document.getElementById('originalCode');
    
    // 从sessionStorage获取项目信息
    const projectName = sessionStorage.getItem('projectName') || 'EngineTest';
    const experimentName = sessionStorage.getItem('experimentName') || 'Engine Test v1';
    const ecuNames = JSON.parse(sessionStorage.getItem('ecuNames') || '[]');
    const selectedFunctions = JSON.parse(sessionStorage.getItem('selectedFunctions') || '[]');
    
    // 显示项目信息
    if (logicProjectName) {
        logicProjectName.textContent = '项目：' + projectName;
    }
    
    if (logicExperimentName) {
        logicExperimentName.textContent = experimentName;
    }
    
    if (logicEcuNames) {
        if (ecuNames.length > 0) {
            logicEcuNames.textContent = ecuNames.join(', ');
        } else {
            logicEcuNames.textContent = '未设置';
        }
    }
    
    // 创建功能点Tab
    if (functionPointTabs && selectedFunctions.length > 0) {
        functionPointTabs.innerHTML = '';
        selectedFunctions.forEach(function(functionName, index) {
            const tab = document.createElement('div');
            tab.className = 'function-point-tab' + (index === 0 ? ' active' : '');
            tab.textContent = functionName;
            tab.dataset.index = index;
            functionPointTabs.appendChild(tab);
        });
    }
    
    // 初始化当前功能点索引和文件索引
    window.currentFunctionIndex = 0;
    window.currentFileIndex = 0;
    window.selectedFunctions = selectedFunctions;
    window.completedFunctions = [];
    window.currentFunctionCompleted = false;
    window.savedFiles = [];
    
    // 获取当前功能点
    const currentFunction = window.selectedFunctions[window.currentFunctionIndex];
    
    // 获取该功能点的用例
    const currentTestcase = currentFunction ? getTestcaseByFunction(currentFunction) : '未选择用例';
    
    // 获取该功能点的所有代码文件
    window.currentCodeFiles = getCodeFilesByFunction(currentFunction);
    
    // 创建文件名Tab
    createFileTabs();
    
    // 更新测试用例预览
    updateTestcasePreview(currentFunction);
    
    // 更新AI生成的原版代码（不可编辑）
    if (aiGeneratedCode) {
        const currentCodeFile = window.currentCodeFiles[window.currentFileIndex];
        const aiCode = getAIGeneratedCode(currentFunction, currentTestcase, currentCodeFile);
        aiGeneratedCode.textContent = aiCode;
    }
    
    // 更新原版代码（可编辑）
    if (originalCode) {
        const currentCodeFile = window.currentCodeFiles[window.currentFileIndex];
        const originalCodeContent = getOriginalCode(currentFunction, currentTestcase, currentCodeFile);
        originalCode.textContent = originalCodeContent;
    }
    
    // 确定按钮点击事件
    const logicCheckConfirmBtn = document.getElementById('logicCheckConfirmBtn');
    const logicCheckNextPageBtn = document.getElementById('logicCheckNextPageBtn');
    
    // 初始化保存按钮状态（启用）
    if (logicCheckConfirmBtn) {
        logicCheckConfirmBtn.disabled = false;
    }
    
    if (logicCheckConfirmBtn && logicCheckNextPageBtn) {
        logicCheckConfirmBtn.addEventListener('click', function() {
            // 标记当前文件为已保存
            if (!window.savedFiles) {
                window.savedFiles = [];
            }
            if (window.savedFiles.indexOf(window.currentFileIndex) === -1) {
                window.savedFiles.push(window.currentFileIndex);
            }
            
            // 禁用保存按钮
            logicCheckConfirmBtn.disabled = true;
            
            // 检查是否已经保存最后一个文件
            if (window.currentFileIndex === window.currentCodeFiles.length - 1) {
                // 已经保存最后一个文件
                // 标记当前功能点为已完成
                if (!window.completedFunctions) {
                    window.completedFunctions = [];
                }
                if (window.completedFunctions.indexOf(window.currentFunctionIndex) === -1) {
                    window.completedFunctions.push(window.currentFunctionIndex);
                }
                window.currentFunctionCompleted = true;
                
                // 检查是否还有更多功能点
                if (window.currentFunctionIndex < window.selectedFunctions.length - 1) {
                    // 还有更多功能点，更新tab状态使其可切换
                    updateFunctionTabStates();
                } else {
                    // 所有功能点评审完成，启用下一页按钮
                    logicCheckNextPageBtn.disabled = false;
                }
            } else {
                // 不是最后一个文件，解锁下一个文件Tab
                updateFileTabStates();
            }
        });
    }
    
    // 功能点Tab点击事件
    if (functionPointTabs) {
        functionPointTabs.addEventListener('click', function(e) {
            const clickedTab = e.target.closest('.function-point-tab');
            if (!clickedTab) return;
            
            const tabIndex = parseInt(clickedTab.dataset.index);
            
            // 检查是否可以切换到这个tab
            // 只有当前功能点完成第5个文件的保存后，才能切换到下一个tab
            if (tabIndex === window.currentFunctionIndex) {
                // 点击的是当前tab，不做处理
                return;
            }
            
            // 检查是否满足切换条件
            if (tabIndex > window.currentFunctionIndex) {
                // 尝试切换到后面的tab
                // 需要当前功能点已经完成第5个文件的保存
                const isCurrentFunctionCompleted = window.currentFunctionCompleted || false;
                if (!isCurrentFunctionCompleted && window.currentFunctionIndex < window.selectedFunctions.length - 1) {
                    // 当前功能点还未完成，不能切换
                    return;
                }
            }
            
            // 执行切换
            window.currentFunctionIndex = tabIndex;
            window.currentFileIndex = 0;
            window.currentFunctionCompleted = false;
            
            // 重置已保存文件列表
            window.savedFiles = [];
            
            // 获取当前功能点
            const currentFunction = window.selectedFunctions[window.currentFunctionIndex];
            
            // 获取该功能点的代码文件
            window.currentCodeFiles = getCodeFilesByFunction(currentFunction);
            
            // 创建文件名Tab
            createFileTabs();
            
            // 更新测试用例预览
            updateTestcasePreview(currentFunction);
            
            // 更新显示
            updateCodeDisplay();
            
            // 更新功能点Tab状态
            updateFunctionTabStates();
        });
    }
    
    // 下一页按钮点击事件
    if (logicCheckNextPageBtn) {
        logicCheckNextPageBtn.addEventListener('click', function() {
            // 跳转到脚本结果页面
            const scriptResultLink = document.querySelector('.sub-menu-link[data-page="script-result"]');
            if (scriptResultLink) {
                // 移除所有子菜单项的激活状态
                const subMenuLinks = document.querySelectorAll('.sub-menu-link');
                subMenuLinks.forEach(function(item) {
                    item.closest('.sub-menu-item').classList.remove('active');
                });
                
                // 激活脚本结果菜单项
                scriptResultLink.closest('.sub-menu-item').classList.add('active');
                
                // 获取逻辑检查页面的项目信息
                const currentProjectName = document.getElementById('logicProjectName');
                const currentExperimentName = document.getElementById('logicExperimentName');
                
                // 更新脚本结果页面的项目信息
                const scriptProjectName = document.getElementById('scriptProjectName');
                const scriptExperimentName = document.getElementById('scriptExperimentName');
                
                if (currentProjectName && scriptProjectName) {
                    scriptProjectName.textContent = currentProjectName.textContent;
                }
                if (currentExperimentName && scriptExperimentName) {
                    scriptExperimentName.textContent = currentExperimentName.textContent;
                }
                
                // 切换到脚本结果页面
                switchPage('script-result');
                
                // 显示脚本结果页面的进度条
                showScriptProgressBar();
            }
        });
    }
}

// 更新代码显示的函数
function updateCodeDisplay() {
    const functionPointTabs = document.getElementById('functionPointTabs');
    const aiGeneratedCode = document.getElementById('aiGeneratedCode');
    const originalCode = document.getElementById('originalCode');
    
    const currentFunction = window.selectedFunctions[window.currentFunctionIndex];
    const currentTestcase = currentFunction ? getTestcaseByFunction(currentFunction) : '未选择用例';
    
    // 更新功能点Tab的激活状态和可切换状态
    updateFunctionTabStates();
    
    // 更新文件名Tab的状态
    updateFileTabStates();
    
    // 更新AI生成的原版代码（不可编辑）
    if (aiGeneratedCode) {
        const currentCodeFile = window.currentCodeFiles[window.currentFileIndex];
        const aiCode = getAIGeneratedCode(currentFunction, currentTestcase, currentCodeFile);
        aiGeneratedCode.textContent = aiCode;
    }
    
    // 更新原版代码（可编辑）
    if (originalCode) {
        const currentCodeFile = window.currentCodeFiles[window.currentFileIndex];
        const originalCodeContent = getOriginalCode(currentFunction, currentTestcase, currentCodeFile);
        originalCode.textContent = originalCodeContent;
    }
    
    // 更新保存按钮状态
    const logicCheckConfirmBtn = document.getElementById('logicCheckConfirmBtn');
    if (logicCheckConfirmBtn) {
        // 检查当前文件是否已保存
        const savedFiles = window.savedFiles || [];
        if (savedFiles.indexOf(window.currentFileIndex) !== -1) {
            // 已保存的文件，禁用按钮
            logicCheckConfirmBtn.disabled = true;
        } else {
            // 未保存的文件，启用按钮
            logicCheckConfirmBtn.disabled = false;
        }
    }
}

// 更新功能点Tab的状态
function updateFunctionTabStates() {
    const functionPointTabs = document.getElementById('functionPointTabs');
    if (!functionPointTabs) return;
    
    const tabs = functionPointTabs.querySelectorAll('.function-point-tab');
    const completedFunctions = window.completedFunctions || [];
    
    tabs.forEach(function(tab, index) {
        // 移除之前的状态类
        tab.classList.remove('active', 'completed', 'locked');
        
        if (index === window.currentFunctionIndex) {
            // 当前tab
            tab.classList.add('active');
        } else if (index < window.currentFunctionIndex || completedFunctions.indexOf(index) !== -1) {
            // 已完成的功能点
            tab.classList.add('completed');
        } else if (index === window.currentFunctionIndex + 1 && (window.currentFunctionCompleted || completedFunctions.indexOf(window.currentFunctionIndex) !== -1)) {
            // 下一个功能点，可以切换
            tab.classList.add('completed');
        } else {
            // 被锁定，不能切换
            tab.classList.add('locked');
        }
    });
}

// 创建文件名Tab
function createFileTabs() {
    const fileTabs = document.getElementById('fileTabs');
    if (!fileTabs || !window.currentCodeFiles) return;
    
    fileTabs.innerHTML = '';
    
    // 初始化已保存文件列表
    if (!window.savedFiles) {
        window.savedFiles = [];
    }
    
    window.currentCodeFiles.forEach(function(fileName, index) {
        const tab = document.createElement('div');
        tab.className = 'file-tab';
        tab.textContent = fileName;
        tab.dataset.index = index;
        
        // 初始状态：只有第一个文件可选，其他都锁定
        if (index === 0) {
            tab.classList.add('active');
            tab.addEventListener('click', function() {
                // 点击当前文件，不做处理
            });
        } else {
            tab.classList.add('locked');
            // 锁定的文件不可点击
            tab.style.pointerEvents = 'none';
        }
        
        fileTabs.appendChild(tab);
    });
}

// 更新文件名Tab的状态
function updateFileTabStates() {
    const fileTabs = document.getElementById('fileTabs');
    if (!fileTabs) return;
    
    const tabs = fileTabs.querySelectorAll('.file-tab');
    const savedFiles = window.savedFiles || [];
    
    tabs.forEach(function(tab, index) {
        // 移除之前的状态类
        tab.classList.remove('active', 'completed', 'locked');
        tab.style.pointerEvents = 'auto';
        
        if (index === window.currentFileIndex) {
            // 当前文件
            tab.classList.add('active');
            tab.onclick = null;
        } else if (savedFiles.indexOf(index) !== -1) {
            // 已保存的文件
            tab.classList.add('completed');
            tab.onclick = function() {
                switchToFile(parseInt(this.dataset.index));
            };
        } else if (index === window.currentFileIndex + 1 && savedFiles.indexOf(window.currentFileIndex) !== -1) {
            // 下一个文件，且当前文件已保存，解锁
            tab.classList.add('completed');
            tab.onclick = function() {
                switchToFile(parseInt(this.dataset.index));
            };
        } else {
            // 未解锁的文件
            tab.classList.add('locked');
            tab.style.pointerEvents = 'none';
            tab.onclick = null;
        }
    });
}

// 切换到指定文件
function switchToFile(fileIndex) {
    if (fileIndex < 0 || fileIndex >= window.currentCodeFiles.length) return;
    
    // 检查是否有未保存的修改
    const originalCode = document.getElementById('originalCode');
    if (originalCode && window.currentFileIndex !== fileIndex) {
        const currentCode = originalCode.textContent;
        const savedCode = getOriginalCode(
            window.selectedFunctions[window.currentFunctionIndex],
            getTestcaseByFunction(window.selectedFunctions[window.currentFunctionIndex]),
            window.currentCodeFiles[window.currentFileIndex]
        );
        
        // 如果当前文件有修改且未保存，提示用户
        if (currentCode !== savedCode && (window.savedFiles || []).indexOf(window.currentFileIndex) === -1) {
            if (!confirm('当前文件有未保存的修改，切换将丢失修改。是否继续？')) {
                return;
            }
        }
    }
    
    window.currentFileIndex = fileIndex;
    
    // 更新显示
    updateCodeDisplay();
}

// 根据功能点获取对应的代码文件列表
function getCodeFilesByFunction(functionName) {
    const codeFilesMap = {
        '验证发动机启动功能': ['test_engine_start.can', 'test_engine_start.cin', 'test_engine_start.py', 'test_engine_start_config.py', 'test_engine_start_utils.py'],
        '验证ABS制动系统': ['test_abs_activation.can', 'test_abs_activation.cin', 'test_abs_activation.py', 'test_abs_config.py', 'test_abs_utils.py'],
        '验证变速箱换挡功能': ['test_gear_shift.can', 'test_gear_shift.cin', 'test_gear_shift.py', 'test_transmission_config.py', 'test_transmission_utils.py'],
        '验证制动系统性能': ['test_brake_pressure.can', 'test_brake_pressure.cin', 'test_brake_pressure.py', 'test_brake_config.py', 'test_brake_utils.py'],
        '验证发动机停止功能': ['test_engine_stop.can', 'test_engine_stop.cin', 'test_engine_stop.py', 'test_engine_stop_config.py', 'test_engine_stop_utils.py']
    };
    return codeFilesMap[functionName] || ['test_default.can', 'test_default.cin', 'test_default.py', 'test_default_config.py', 'test_default_utils.py'];
}

// 根据功能点获取对应的用例
function getTestcaseByFunction(functionName) {
    const testcaseMap = {
        '验证发动机启动功能': 'test_engine_start',
        '验证ABS制动系统': 'test_abs_activation',
        '验证变速箱换挡功能': 'test_gear_shift',
        '验证制动系统性能': 'test_brake_pressure',
        '验证发动机停止功能': 'test_engine_stop'
    };
    return testcaseMap[functionName] || '未知用例';
}

// 根据功能点获取对应的测试用例数据
function getTestcaseDataByFunction(functionName) {
    const testcaseDataMap = {
        '验证发动机启动功能': [
            {
                projectName: 'EngineTest',
                sectionIndex: '1',
                module: 'Engine',
                functionTitle: '验证发动机启动功能',
                initials: 'ES',
                actions: '1. 打开点火开关\n2. 检查发动机状态指示灯\n3. 启动发动机\n4. 观察发动机转速',
                expectedResults: '发动机正常启动，转速稳定在800-1000rpm'
            }
        ],
        '验证ABS制动系统': [
            {
                projectName: 'EngineTest',
                sectionIndex: '1',
                module: 'Brake',
                functionTitle: '验证ABS制动系统',
                initials: 'ABS',
                actions: '1. 将车辆加速至60km/h\n2. 紧急踩下制动踏板\n3. 观察ABS指示灯\n4. 检查制动效果',
                expectedResults: 'ABS系统正常激活，制动距离在安全范围内'
            }
        ],
        '验证变速箱换挡功能': [
            {
                projectName: 'EngineTest',
                sectionIndex: '1',
                module: 'Transmission',
                functionTitle: '验证变速箱换挡功能',
                initials: 'GS',
                actions: '1. 启动发动机\n2. 踩下加速踏板\n3. 观察换挡点\n4. 检查换挡平顺性',
                expectedResults: '变速箱在指定转速下正常换挡，换挡过程平顺'
            }
        ],
        '验证制动系统性能': [
            {
                projectName: 'EngineTest',
                sectionIndex: '1',
                module: 'Brake',
                functionTitle: '验证制动系统性能',
                initials: 'BP',
                actions: '1. 测量制动踏板自由行程\n2. 检查制动液位\n3. 进行制动测试\n4. 测量制动距离',
                expectedResults: '制动系统各项指标符合设计要求'
            }
        ],
        '验证发动机停止功能': [
            {
                projectName: 'EngineTest',
                sectionIndex: '1',
                module: 'Engine',
                functionTitle: '验证发动机停止功能',
                initials: 'ES',
                actions: '1. 确保发动机处于运行状态\n2. 关闭点火开关\n3. 观察发动机熄火过程\n4. 检查是否有异常声音',
                expectedResults: '发动机正常熄火，无异常声音或震动'
            }
        ]
    };
    return testcaseDataMap[functionName] || [];
}

// 更新测试用例预览
function updateTestcasePreview(functionName) {
    const logicTestcasePreviewBody = document.getElementById('logicTestcasePreviewBody');
    if (!logicTestcasePreviewBody) return;
    
    const testcaseData = getTestcaseDataByFunction(functionName);
    if (testcaseData.length === 0) return;
    
    const firstTestcase = testcaseData[0];
    
    logicTestcasePreviewBody.innerHTML = `
        <tr>
            <td>${firstTestcase.projectName}</td>
            <td>${firstTestcase.sectionIndex}</td>
            <td>${firstTestcase.module}</td>
            <td>${firstTestcase.functionTitle}</td>
            <td>${firstTestcase.initials}</td>
            <td>${firstTestcase.actions.replace(/\n/g, '<br>')}</td>
            <td>${firstTestcase.expectedResults}</td>
        </tr>
    `;
}

// 获取AI生成的代码
function getAIGeneratedCode(functionName, testcaseName, codeFile) {
    if (codeFile.endsWith('.can')) {
        return `/*
 * ${functionName} - CAN Message Definition
 * Generated by AI System
 */

VERSION 1.0

BO_ 100 ${testcaseName}_Msg: 8 Vector__XXX
 SG_ Signal1 : 0|16@1+ (0.1,0) [0|6553.5] "V" Vector__XXX
 SG_ Signal2 : 16|8@1+ (1,0) [0|255] "Unit" Vector__XXX
 SG_ Signal3 : 24|1@1+ (1,0) [0|1] "Flag" Vector__XXX
 SG_ Signal4 : 25|3@1+ (1,0) [0|7] "Status" Vector__XXX

BO_ 200 ${testcaseName}_Response: 8 Vector__XXX
 SG_ ResponseCode : 0|8@1+ (1,0) [0|255] "" Vector__XXX
 SG_ DataValue : 8|16@1+ (0.01,0) [0|655.35] "V" Vector__XXX

VAL_ 100 Signal3 0 "Inactive" 1 "Active";
VAL_ 100 Signal4 0 "Idle" 1 "Running" 2 "Error" 3 "Unknown";
`;
    } else if (codeFile.endsWith('.cin')) {
        return `/*
 * ${functionName} - CAPL Script
 * Generated by AI System
 */

includes
{
}

variables
{
    message ${testcaseName}_Msg msg;
    message ${testcaseName}_Response response;
    timer checkTimer;
    int testResult = 0;
}

on start
{
    write("Starting ${functionName} test...");
    setTimer(checkTimer, 1);
}

on timer checkTimer
{
    msg.Signal1 = 100;
    msg.Signal2 = 50;
    msg.Signal3 = 1;
    msg.Signal4 = 1;
    output(msg);
    
    write("Message sent: Signal1=%d, Signal2=%d", msg.Signal1, msg.Signal2);
}

on message ${testcaseName}_Response
{
    if(this.ResponseCode == 0)
    {
        testResult = 1;
        write("Test passed: ResponseCode=%d, DataValue=%.2f", this.ResponseCode, this.DataValue);
    }
    else
    {
        testResult = -1;
        write("Test failed: ResponseCode=%d", this.ResponseCode);
    }
}
`;
    } else if (codeFile.endsWith('.py') && !codeFile.includes('_config') && !codeFile.includes('_utils')) {
        return `# -*- coding: utf-8 -*-
"""
${functionName}测试脚本
Test Module for ${functionName}
"""

import pytest
import time
from config import Config
from utils import TestUtils

class Test${testcaseName.charAt(0).toUpperCase() + testcaseName.slice(1)}:
    """${functionName}测试类"""
    
    def setup_method(self):
        """测试前置设置"""
        self.config = Config()
        self.utils = TestUtils()
        
    def test_normal_operation(self):
        """测试正常操作"""
        result = self.utils.execute_test()
        assert result == True, "测试应该成功"
        
    def test_edge_case(self):
        """测试边界情况"""
        result = self.utils.check_boundary()
        assert result == True, "边界测试应该通过"
        
    def test_error_handling(self):
        """测试错误处理"""
        with pytest.raises(ValueError):
            self.utils.trigger_error()
`;
    } else if (codeFile.includes('_config.py')) {
        return `# -*- coding: utf-8 -*-
"""
${functionName}配置文件
Configuration Module for ${functionName}
"""

class ${testcaseName}Config:
    """${functionName}配置类"""
    
    def __init__(self):
        """初始化配置"""
        self.timeout = 30
        self.retry_count = 3
        self.debug_mode = False
        
    def get_timeout(self):
        """获取超时时间"""
        return self.timeout
        
    def set_timeout(self, timeout):
        """设置超时时间"""
        self.timeout = timeout
        
    def get_retry_count(self):
        """获取重试次数"""
        return self.retry_count
        
    def set_retry_count(self, count):
        """设置重试次数"""
        self.retry_count = count
        
    def enable_debug(self):
        """启用调试模式"""
        self.debug_mode = True
        
    def disable_debug(self):
        """禁用调试模式"""
        self.debug_mode = False
`;
    } else if (codeFile.includes('_utils.py')) {
        return `# -*- coding: utf-8 -*-
"""
${functionName}工具函数
Utility Functions for ${functionName}
"""

import time
import logging

class ${testcaseName}Utils:
    """${functionName}工具类"""
    
    @staticmethod
    def wait_for_condition(condition, timeout=30, interval=0.5):
        """等待条件满足"""
        start_time = time.time()
        while time.time() - start_time < timeout:
            if condition():
                return True
            time.sleep(interval)
        raise TimeoutError("条件在30秒内未满足")
    
    @staticmethod
    def log_message(message, level="INFO"):
        """记录日志"""
        timestamp = time.strftime("%Y-%m-%d %H:%M:%S")
        print("[" + timestamp + "] [" + level + "] " + message)
    
    @staticmethod
    def check_signal(signal_name):
        """检查信号状态"""
        return True
`;
    } else if (codeFile.includes('_data.py')) {
        return `# -*- coding: utf-8 -*-
"""
${functionName}数据管理
Data Management for ${functionName}
"""

import json
import os

class ${testcaseName}DataManager:
    """${functionName}数据管理类"""
    
    def __init__(self, data_file='test_data.json'):
        """初始化数据管理器"""
        self.data_file = data_file
        self.data = self.load_data()
        
    def load_data(self):
        """加载数据"""
        if os.path.exists(self.data_file):
            with open(self.data_file, 'r', encoding='utf-8') as f:
                return json.load(f)
        return {}
        
    def save_data(self):
        """保存数据"""
        with open(self.data_file, 'w', encoding='utf-8') as f:
            json.dump(self.data, f, indent=2, ensure_ascii=False)
            
    def get_test_data(self, key):
        """获取测试数据"""
        return self.data.get(key, {})
        
    def set_test_data(self, key, value):
        """设置测试数据"""
        self.data[key] = value
        self.save_data()
`;
    } else if (codeFile.includes('_report.py')) {
        return `# -*- coding: utf-8 -*-
"""
${functionName}报告生成
Report Generation for ${functionName}
"""

import time
from datetime import datetime

class ${testcaseName}Report:
    """${functionName}报告类"""
    
    def __init__(self):
        """初始化报告"""
        self.test_results = []
        self.start_time = None
        self.end_time = None
        
    def start_test(self, test_name):
        """开始测试"""
        self.start_time = time.time()
        print("开始测试: " + test_name + " at " + str(datetime.now()))
        
    def end_test(self, test_name, result):
        """结束测试"""
        self.end_time = time.time()
        duration = self.end_time - self.start_time
        print("结束测试: " + test_name + ", 结果: " + result + ", 耗时: " + str(round(duration, 2)) + "秒")
        self.test_results.append({
            'test_name': test_name,
            'result': result,
            'duration': duration,
            'timestamp': datetime.now().isoformat()
        })
        
    def generate_report(self):
        """生成报告"""
        print("=" * 50)
        print("测试报告")
        print("=" * 50)
        for result in self.test_results:
            print("测试: " + result['test_name'])
            print("结果: " + result['result'])
            print("耗时: " + str(round(result['duration'], 2)) + "秒")
            print("时间: " + result['timestamp'])
            print("-" * 30)
`;
    } else {
        const codeTemplates = {
            'test_engine_start': `# -*- coding: utf-8 -*-
"""
发动机启动测试脚本
Engine Start Test Module
"""

import pytest
import time
from config import EngineConfig
from utils import EngineUtils

class TestEngineStart:
    """发动机启动测试类"""
    
    def test_engine_start_normal(self):
        """测试发动机正常启动"""
        config = EngineConfig()
        assert not EngineUtils.is_engine_running(), "发动机应该处于停止状态"
        EngineUtils.start_engine()
        time.sleep(2)
        assert EngineUtils.is_engine_running(), "发动机应该已经启动"
        assert EngineUtils.get_engine_rpm() > 0, "发动机转速应该大于0"
        
    def test_engine_start_cold(self):
        """测试冷启动"""
        config = EngineConfig()
        config.set_temperature(-10)
        EngineUtils.start_engine()
        time.sleep(3)
        assert EngineUtils.is_engine_running()
        
    def test_engine_start_hot(self):
        """测试热启动"""
        config = EngineConfig()
        config.set_temperature(90)
        EngineUtils.start_engine()
        time.sleep(1)
        assert EngineUtils.is_engine_running()
`,

            'test_abs_activation': `# -*- coding: utf-8 -*-
"""
ABS制动系统测试脚本
ABS Brake System Test Module
"""

import pytest
from config import ABSConfig
from utils import ABSUtils

class TestABSActivation:
    """ABS激活测试类"""
    
    def test_abs_activation_normal(self):
        """测试ABS正常激活"""
        config = ABSConfig()
        assert ABSUtils.is_abs_ready(), "ABS系统应该就绪"
        ABSUtils.emergency_brake()
        assert ABSUtils.is_abs_active(), "ABS应该已激活"
        
    def test_abs_activation_low_speed(self):
        """测试低速时ABS激活"""
        config = ABSConfig()
        config.set_speed(10)
        ABSUtils.emergency_brake()
        assert not ABSUtils.is_abs_active(), "低速时ABS不应该激活"
        
    def test_abs_activation_high_speed(self):
        """测试高速时ABS激活"""
        config = ABSConfig()
        config.set_speed(80)
        ABSUtils.emergency_brake()
        assert ABSUtils.is_abs_active(), "高速时ABS应该激活"
`,

            'test_gear_shift': `# -*- coding: utf-8 -*-
"""
变速箱换挡测试脚本
Transmission Gear Shift Test Module
"""

import pytest
from config import TransmissionConfig
from utils import TransmissionUtils

class TestGearShift:
    """换挡测试类"""
    
    def test_gear_shift_up(self):
        """测试升挡"""
        config = TransmissionConfig()
        assert TransmissionUtils.get_current_gear() == 1, "初始挡位应该是1挡"
        TransmissionUtils.shift_up()
        assert TransmissionUtils.get_current_gear() == 2, "挡位应该升到2挡"
        
    def test_gear_shift_down(self):
        """测试降挡"""
        config = TransmissionConfig()
        TransmissionUtils.shift_up()
        TransmissionUtils.shift_down()
        assert TransmissionUtils.get_current_gear() == 1, "挡位应该降到1挡"
        
    def test_gear_shift_auto(self):
        """测试自动换挡"""
        config = TransmissionConfig()
        config.set_auto_mode(True)
        TransmissionUtils.accelerate(50)
        assert TransmissionUtils.get_current_gear() > 1, "应该自动升挡"
`,

            'test_brake_pressure': `# -*- coding: utf-8 -*-
"""
制动系统性能测试脚本
Brake System Performance Test Module
"""

import pytest
from config import BrakeConfig
from utils import BrakeUtils

class TestBrakePressure:
    """制动压力测试类"""
    
    def test_brake_pressure_normal(self):
        """测试正常制动压力"""
        config = BrakeConfig()
        assert BrakeUtils.get_brake_pressure() == 0, "初始制动压力应该为0"
        BrakeUtils.apply_brake(50)
        assert BrakeUtils.get_brake_pressure() == 50, "制动压力应该是50"
        
    def test_brake_pressure_emergency(self):
        """测试紧急制动压力"""
        config = BrakeConfig()
        BrakeUtils.emergency_brake()
        assert BrakeUtils.get_brake_pressure() == 100, "紧急制动压力应该是100"
        
    def test_brake_pressure_release(self):
        """测试制动释放"""
        config = BrakeConfig()
        BrakeUtils.apply_brake(50)
        BrakeUtils.release_brake()
        assert BrakeUtils.get_brake_pressure() == 0, "制动压力应该释放为0"
`,

            'test_engine_stop': `# -*- coding: utf-8 -*-
"""
发动机停止测试脚本
Engine Stop Test Module
"""

import pytest
import time
from config import EngineConfig
from utils import EngineUtils

class TestEngineStop:
    """发动机停止测试类"""
    
    def test_engine_stop_normal(self):
        """测试发动机正常停止"""
        config = EngineConfig()
        EngineUtils.start_engine()
        time.sleep(2)
        assert EngineUtils.is_engine_running(), "发动机应该正在运行"
        EngineUtils.stop_engine()
        time.sleep(2)
        assert not EngineUtils.is_engine_running(), "发动机应该已经停止"
        
    def test_engine_stop_emergency(self):
        """测试紧急停止"""
        config = EngineConfig()
        EngineUtils.start_engine()
        EngineUtils.emergency_stop()
        time.sleep(1)
        assert not EngineUtils.is_engine_running()
        
    def test_engine_stop_after_drive(self):
        """测试行驶后停止"""
        config = EngineConfig()
        EngineUtils.start_engine()
        EngineUtils.set_speed(60)
        time.sleep(3)
        EngineUtils.stop_engine()
        time.sleep(2)
        assert not EngineUtils.is_engine_running()
`
        };
        
        return codeTemplates[testcaseName] || '# 默认代码模板';
    }
}

// 获取原版代码
function getOriginalCode(functionName, testcaseName, codeFile) {
    if (codeFile.endsWith('.can')) {
        return `/*
 * ${functionName} - CAN Message Definition
 * Original Version
 */

VERSION 1.0

BO_ 100 ${testcaseName}_Msg: 8 Vector__XXX
 SG_ Signal1 : 0|16@1+ (0.1,0) [0|6553.5] "V" Vector__XXX
 SG_ Signal2 : 16|8@1+ (1,0) [0|255] "Unit" Vector__XXX
 SG_ Signal3 : 24|1@1+ (1,0) [0|1] "Flag" Vector__XXX
 SG_ Signal4 : 25|3@1+ (1,0) [0|7] "Status" Vector__XXX

BO_ 200 ${testcaseName}_Response: 8 Vector__XXX
 SG_ ResponseCode : 0|8@1+ (1,0) [0|255] "" Vector__XXX
 SG_ DataValue : 8|16@1+ (0.01,0) [0|655.35] "V" Vector__XXX

VAL_ 100 Signal3 0 "Inactive" 1 "Active";
VAL_ 100 Signal4 0 "Idle" 1 "Running" 2 "Error" 3 "Unknown";
`;
    } else if (codeFile.endsWith('.cin')) {
        return `/*
 * ${functionName} - CAPL Script
 * Original Version
 */

includes
{
}

variables
{
    message ${testcaseName}_Msg msg;
    message ${testcaseName}_Response response;
    timer checkTimer;
    int testResult = 0;
}

on start
{
    write("Starting ${functionName} test...");
    setTimer(checkTimer, 1);
}

on timer checkTimer
{
    msg.Signal1 = 100;
    msg.Signal2 = 50;
    msg.Signal3 = 1;
    msg.Signal4 = 1;
    output(msg);
    
    write("Message sent: Signal1=%d, Signal2=%d", msg.Signal1, msg.Signal2);
}

on message ${testcaseName}_Response
{
    if(this.ResponseCode == 0)
    {
        testResult = 1;
        write("Test passed: ResponseCode=%d, DataValue=%.2f", this.ResponseCode, this.DataValue);
    }
    else
    {
        testResult = -1;
        write("Test failed: ResponseCode=%d", this.ResponseCode);
    }
}
`;
    } else if (codeFile.endsWith('.py') && !codeFile.includes('_config') && !codeFile.includes('_utils')) {
        return `# -*- coding: utf-8 -*-
"""
${functionName}测试脚本
Test Module for ${functionName}
"""

import pytest
import time
from config import Config
from utils import TestUtils

class Test${testcaseName.charAt(0).toUpperCase() + testcaseName.slice(1)}:
    """${functionName}测试类"""
    
    def setup_method(self):
        """测试前置设置"""
        self.config = Config()
        self.utils = TestUtils()
        
    def test_normal_operation(self):
        """测试正常操作"""
        result = self.utils.execute_test()
        assert result == True, "测试应该成功"
        
    def test_edge_case(self):
        """测试边界情况"""
        result = self.utils.check_boundary()
        assert result == True, "边界测试应该通过"
        
    def test_error_handling(self):
        """测试错误处理"""
        with pytest.raises(ValueError):
            self.utils.trigger_error()
`;
    } else if (codeFile.includes('_config.py')) {
        return `# -*- coding: utf-8 -*-
"""
${functionName}配置文件
Configuration Module for ${functionName}
"""

class ${testcaseName}Config:
    """${functionName}配置类"""
    
    def __init__(self):
        """初始化配置"""
        self.timeout = 30
        self.retry_count = 3
        self.debug_mode = False
        
    def get_timeout(self):
        """获取超时时间"""
        return self.timeout
        
    def set_timeout(self, timeout):
        """设置超时时间"""
        self.timeout = timeout
        
    def get_retry_count(self):
        """获取重试次数"""
        return self.retry_count
        
    def set_retry_count(self, count):
        """设置重试次数"""
        self.retry_count = count
        
    def enable_debug(self):
        """启用调试模式"""
        self.debug_mode = True
        
    def disable_debug(self):
        """禁用调试模式"""
        self.debug_mode = False
`;
    } else if (codeFile.includes('_utils.py')) {
        return `# -*- coding: utf-8 -*-
"""
${functionName}工具函数
Utility Functions for ${functionName}
"""

import time
import logging

class ${testcaseName}Utils:
    """${functionName}工具类"""
    
    @staticmethod
    def wait_for_condition(condition, timeout=30, interval=0.5):
        """等待条件满足"""
        start_time = time.time()
        while time.time() - start_time < timeout:
            if condition():
                return True
            time.sleep(interval)
        raise TimeoutError("条件在30秒内未满足")
    
    @staticmethod
    def log_message(message, level="INFO"):
        """记录日志"""
        timestamp = time.strftime("%Y-%m-%d %H:%M:%S")
        print("[" + timestamp + "] [" + level + "] " + message)
    
    @staticmethod
    def check_signal(signal_name):
        """检查信号状态"""
        return True
`;
    } else if (codeFile.includes('_data.py')) {
        return `# -*- coding: utf-8 -*-
"""
${functionName}数据管理
Data Management for ${functionName}
"""

import json
import os

class ${testcaseName}DataManager:
    """${functionName}数据管理类"""
    
    def __init__(self, data_file='test_data.json'):
        """初始化数据管理器"""
        self.data_file = data_file
        self.data = self.load_data()
        
    def load_data(self):
        """加载数据"""
        if os.path.exists(self.data_file):
            with open(self.data_file, 'r', encoding='utf-8') as f:
                return json.load(f)
        return {}
        
    def save_data(self):
        """保存数据"""
        with open(self.data_file, 'w', encoding='utf-8') as f:
            json.dump(self.data, f, indent=2, ensure_ascii=False)
            
    def get_test_data(self, key):
        """获取测试数据"""
        return self.data.get(key, {})
        
    def set_test_data(self, key, value):
        """设置测试数据"""
        self.data[key] = value
        self.save_data()
`;
    } else if (codeFile.includes('_report.py')) {
        return `# -*- coding: utf-8 -*-
"""
${functionName}报告生成
Report Generation for ${functionName}
"""

import time
from datetime import datetime

class ${testcaseName}Report:
    """${functionName}报告类"""
    
    def __init__(self):
        """初始化报告"""
        self.test_results = []
        self.start_time = None
        self.end_time = None
        
    def start_test(self, test_name):
        """开始测试"""
        self.start_time = time.time()
        print("开始测试: " + test_name + " at " + str(datetime.now()))
        
    def end_test(self, test_name, result):
        """结束测试"""
        self.end_time = time.time()
        duration = self.end_time - self.start_time
        print("结束测试: " + test_name + ", 结果: " + result + ", 耗时: " + str(round(duration, 2)) + "秒")
        self.test_results.append({
            'test_name': test_name,
            'result': result,
            'duration': duration,
            'timestamp': datetime.now().isoformat()
        })
        
    def generate_report(self):
        """生成报告"""
        print("=" * 50)
        print("测试报告")
        print("=" * 50)
        for result in self.test_results:
            print("测试: " + result['test_name'])
            print("结果: " + result['result'])
            print("耗时: " + str(round(result['duration'], 2)) + "秒")
            print("时间: " + result['timestamp'])
            print("-" * 30)
`;
    } else {
        const codeTemplates = {
            'test_engine_start': `# -*- coding: utf-8 -*-
"""
发动机启动测试脚本
Engine Start Test Module
"""

import pytest
import time
from config import EngineConfig
from utils import EngineUtils

class TestEngineStart:
    """发动机启动测试类"""
    
    def test_engine_start_normal(self):
        """测试发动机正常启动"""
        config = EngineConfig()
        assert not EngineUtils.is_engine_running(), "发动机应该处于停止状态"
        EngineUtils.start_engine()
        time.sleep(2)
        assert EngineUtils.is_engine_running(), "发动机应该已经启动"
        assert EngineUtils.get_engine_rpm() > 0, "发动机转速应该大于0"
        
    def test_engine_start_cold(self):
        """测试冷启动"""
        config = EngineConfig()
        config.set_temperature(-10)
        EngineUtils.start_engine()
        time.sleep(3)
        assert EngineUtils.is_engine_running()
        
    def test_engine_start_hot(self):
        """测试热启动"""
        config = EngineConfig()
        config.set_temperature(90)
        EngineUtils.start_engine()
        time.sleep(1)
        assert EngineUtils.is_engine_running()
`,

            'test_abs_activation': `# -*- coding: utf-8 -*-
"""
ABS制动系统测试脚本
ABS Brake System Test Module
"""

import pytest
from config import ABSConfig
from utils import ABSUtils

class TestABSActivation:
    """ABS激活测试类"""
    
    def test_abs_activation_normal(self):
        """测试ABS正常激活"""
        config = ABSConfig()
        assert ABSUtils.is_abs_ready(), "ABS系统应该就绪"
        ABSUtils.emergency_brake()
        assert ABSUtils.is_abs_active(), "ABS应该已激活"
        
    def test_abs_activation_low_speed(self):
        """测试低速时ABS激活"""
        config = ABSConfig()
        config.set_speed(10)
        ABSUtils.emergency_brake()
        assert not ABSUtils.is_abs_active(), "低速时ABS不应该激活"
        
    def test_abs_activation_high_speed(self):
        """测试高速时ABS激活"""
        config = ABSConfig()
        config.set_speed(80)
        ABSUtils.emergency_brake()
        assert ABSUtils.is_abs_active(), "高速时ABS应该激活"
`,

            'test_gear_shift': `# -*- coding: utf-8 -*-
"""
变速箱换挡测试脚本
Transmission Gear Shift Test Module
"""

import pytest
from config import TransmissionConfig
from utils import TransmissionUtils

class TestGearShift:
    """换挡测试类"""
    
    def test_gear_shift_up(self):
        """测试升挡"""
        config = TransmissionConfig()
        assert TransmissionUtils.get_current_gear() == 1, "初始挡位应该是1挡"
        TransmissionUtils.shift_up()
        assert TransmissionUtils.get_current_gear() == 2, "挡位应该升到2挡"
        
    def test_gear_shift_down(self):
        """测试降挡"""
        config = TransmissionConfig()
        TransmissionUtils.shift_up()
        TransmissionUtils.shift_down()
        assert TransmissionUtils.get_current_gear() == 1, "挡位应该降到1挡"
        
    def test_gear_shift_auto(self):
        """测试自动换挡"""
        config = TransmissionConfig()
        config.set_auto_mode(True)
        TransmissionUtils.accelerate(50)
        assert TransmissionUtils.get_current_gear() > 1, "应该自动升挡"
`,

            'test_brake_pressure': `# -*- coding: utf-8 -*-
"""
制动系统性能测试脚本
Brake System Performance Test Module
"""

import pytest
from config import BrakeConfig
from utils import BrakeUtils

class TestBrakePressure:
    """制动压力测试类"""
    
    def test_brake_pressure_normal(self):
        """测试正常制动压力"""
        config = BrakeConfig()
        assert BrakeUtils.get_brake_pressure() == 0, "初始制动压力应该为0"
        BrakeUtils.apply_brake(50)
        assert BrakeUtils.get_brake_pressure() == 50, "制动压力应该是50"
        
    def test_brake_pressure_emergency(self):
        """测试紧急制动压力"""
        config = BrakeConfig()
        BrakeUtils.emergency_brake()
        assert BrakeUtils.get_brake_pressure() == 100, "紧急制动压力应该是100"
        
    def test_brake_pressure_release(self):
        """测试制动释放"""
        config = BrakeConfig()
        BrakeUtils.apply_brake(50)
        BrakeUtils.release_brake()
        assert BrakeUtils.get_brake_pressure() == 0, "制动压力应该释放为0"
`,

            'test_engine_stop': `# -*- coding: utf-8 -*-
"""
发动机停止测试脚本
Engine Stop Test Module
"""

import pytest
import time
from config import EngineConfig
from utils import EngineUtils

class TestEngineStop:
    """发动机停止测试类"""
    
    def test_engine_stop_normal(self):
        """测试发动机正常停止"""
        config = EngineConfig()
        EngineUtils.start_engine()
        time.sleep(2)
        assert EngineUtils.is_engine_running(), "发动机应该正在运行"
        EngineUtils.stop_engine()
        time.sleep(2)
        assert not EngineUtils.is_engine_running(), "发动机应该已经停止"
        
    def test_engine_stop_emergency(self):
        """测试紧急停止"""
        config = EngineConfig()
        EngineUtils.start_engine()
        EngineUtils.emergency_stop()
        time.sleep(1)
        assert not EngineUtils.is_engine_running()
        
    def test_engine_stop_after_drive(self):
        """测试行驶后停止"""
        config = EngineConfig()
        EngineUtils.start_engine()
        EngineUtils.set_speed(60)
        time.sleep(3)
        EngineUtils.stop_engine()
        time.sleep(2)
        assert not EngineUtils.is_engine_running()
`
        };
        
        return codeTemplates[testcaseName] || '# 默认代码模板';
    }
}
